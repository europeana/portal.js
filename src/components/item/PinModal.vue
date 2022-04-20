<template>
  <b-modal
    :id="modalId"
    :title="$t('record.actions.pin')"
    hide-footer
    hide-header-close
    :static="modalStatic"
    @show="fetchPinningData"
  >
    <b-button
      v-for="(entity, index) in allRelatedEntities"
      :key="index"
      :disabled="!fetched"
      :pressed="selected === entity.id"
      :data-qa="`pin item to entity choice`"
      class="btn-collection w-100 text-left d-flex"
      @click="selectEntity(entity.id)"
    >
      <span
        class="mr-auto"
      >
        {{ entity.prefLabel.en }}
      </span>
      <span
        class="icons text-left d-flex justify-content-end"
      >
        <span
          v-if="selected === entity.id"
          class="icon-check-circle d-inline-flex ml-auto"
        />
        <span
          v-if="pinnedTo(entity.id)"
          class="icon-push-pin d-inline-flex"
        />
      </span>
    </b-button>
    <div class="modal-footer">
      <b-button
        variant="outline-primary"
        data-qa="cancel button"
        @click="hide"
      >
        {{ $t('entity.actions.cancel') }}
      </b-button>
      <b-button
        v-if="selectedIsPinned || !selectedIsFull"
        :disabled="!selected"
        variant="primary"
        data-qa="toggle pin button"
        @click="togglePin"
      >
        {{ selectedIsPinned ? $t('entity.actions.unpin') : $t('entity.actions.pin') }}
      </b-button>
      <span
        v-else-if="selectedIsFull"
      >
        {{ $t('entity.notifications.pinLimit.body') }}
        <SmartLink
          data-qa="go to set link"
          :destination="selectedLink"
        >
          {{ $t('entity.actions.viewPinned') }}
        </SmartLink>
      </span>
    </div>
  </b-modal>
</template>

<script>
  import pick from 'lodash/pick';
  import { mapGetters, mapState } from 'vuex';
  import makeToastMixin from '@/mixins/makeToast';
  // import SmartLink from '@/components/generic/SmartLink';

  export default {
    name: 'PinModal',

    components: {
      SmartLink: () => import('@/components/generic/SmartLink')
    },

    mixins: [
      makeToastMixin
    ],

    props: {
      modalId: {
        type: String,
        default: 'pin-modal'
      },
      entities: {
        type: Array,
        default: () => []
      },
      /**
       * Used for testing, in order to render the modal.
       */
      modalStatic: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        fetched: false,
        selected: null
      };
    },

    computed: {
      selectedIsPinned() {
        return this.selected && this.pinnedTo(this.selected);
      },
      selectedIsFull() {
        return this.selected && this.featuredSetPins[this.selected]?.length >= 24;
      },
      selectedLink() {
        const destination = { name: 'set-all', params: { pathMatch: this.selected && this.featuredSetIds[this.selected].replace('http://data.europeana.eu/set/', '') } };
        return destination;
      },
      selectedEntityPrefLabel() {
        return this.allRelatedEntities.find(entity => entity.id === this.selected)?.prefLabel?.en;
      },
      ...mapGetters({
        itemId: 'item/id',
        pinnedTo: 'item/pinnedTo'
      }),
      ...mapState({
        featuredSetPins: state => state.item.featuredSetPins,
        featuredSetIds: state => state.item.featuredSetIds,
        allRelatedEntities: state => state.item.allRelatedEntities
      })
    },

    methods: {
      fetchPinningData() {
        // TODO: Don't fetch all entities if related entities are already present and less than 5. Set all entities to related entities instead for that scenario.
        return this.$apis.entity.find(this.entities)
          .then(entities => entities.map(entity => pick(entity, ['id', 'prefLabel', 'isShownBy', 'logo'])))
          .then(async(reduced) => {
            await this.$store.commit('item/setAllRelatedEntities', reduced);
            const entityIds = reduced.map(entity => entity.id);
            await this.fetchFeaturedSetData(entityIds);
          })
          .then(() => {
            this.fetched = true;
          });
      },

      async fetchFeaturedSetData(entityIds) {
        const searchParams = {
          query: 'type:EntityBestItemsSet',
          profile: 'minimal',
          pageSize: 1
        };
        for (const entityId of entityIds) {
          // TODO: "OR" the ids to avoid looping, but doesn't seem supported.
          searchParams.qf = `subject:${entityId}`;
          await this.$apis.set.search(searchParams)
            .then(async(searchResponse) => {
              if (searchResponse.data?.total > 0) {
                await this.getSetData(searchResponse.data.items[0].split('/').pop());
              }
              // TODO: Should  an else block actually be RESETTING the store to empty values?
            });
        }
      },

      async getSetData(setId) {
        const options = {
          profile: 'standard',
          pageSize: 100
        };
        await this.$apis.set.get(setId, options)
          .then(async(response) => {
            await this.$store.commit('item/addToFeaturedSetIds', {
              entityUri: response.subject[0],
              setId
            });
            if (response.pinned) { // When pins exist, they need to be sliced from the items, as sets may in future contain recommended items too.
              const pinnedItemIds = response.items.map(item => item.replace('http://data.europeana.eu/item', '')).slice(0, response.pinned);
              await this.$store.commit('item/addToFeaturedSetPins', {
                entityUri: response.subject[0],
                pins: pinnedItemIds
              });
            } else {
              await this.$store.commit('item/addToFeaturedSetPins', {
                entityUri: response.subject[0],
                pins: []
              });
            }
          });
      },

      ensureSelectedSetExists() {
        if (!this.featuredSetIds[this.selected]) {
          const featuredSetBody = {
            type: 'EntityBestItemsSet',
            title: { 'en': this.selectedEntityPrefLabel + ' Page' },
            subject: [this.selected]
          };
          return this.$apis.set.create(featuredSetBody)
            .then(async(response) => {
              await this.$store.commit('item/addToFeaturedSetIds', { entityUri: this.selected, setId: response.id });
              await this.$store.commit('item/addToFeaturedSetPins', { entityUri: this.selected, pins: [] }); // Instatniate blank pins on new set
            });
        }
        return Promise.resolve();
      },

      async pin() {
        await this.ensureSelectedSetExists();
        await this.$apis.set.modifyItems('add', this.featuredSetIds[this.selected], this.itemId, true)
          .then(() => {
            const pinOnSetArgs = { entityUri: this.selected, pin: this.itemId };
            return this.$store.commit('item/addPinToFeaturedSetPins', pinOnSetArgs);
          })
          .then(() => {
            this.makeToast(this.$t('entity.notifications.pinned', { entity: this.selectedEntityPrefLabel }));
            this.hide(); // should the box stay open?
          });
      },
      async unpin() {
        await this.$apis.set.modifyItems('delete', this.featuredSetIds[this.selected], this.itemId)
          .then(() =>  {
            // TODO: instead of refetching everything, this could update the store only.
            this.fetchFeaturedSetData([this.selected]);
          }).then(() => {
            const msg = this.$t('entity.notifications.unpinned');
            this.makeToast(msg);
          })
          .catch((e) => {
            // TODO: instead of refetching everything, this could update the store only.
            this.fetchFeaturedSetData([this.selected]);
            // TODO: notify the user with a toast?
            throw e;
          });
        this.hide(); // should the box stay open?
      },
      selectEntity(id) {
        this.selected = id;
      },
      async togglePin() {
        if (this.selectedIsPinned) {
          await this.unpin();
        } else {
          await this.pin();
        }
      },
      hide() {
        this.selected = null;
        this.$bvModal.hide(this.modalId);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  .btn-collection {
    border: 0;
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    padding: 1rem;
    position: relative;
    text-transform: none;

    span {
      position: relative;
      z-index: 10;

      &.icon-check-circle,
      &.icon-push-pin {
        margin-left: auto;
        font-size: $font-size-large;
      }
    }
  }
</style>
