<template>
  <b-modal
    :id="modalId"
    :title="$t('record.actions.pin')"
    @show="fetchPinningData"
    hide-footer
    hide-header-close
  >
    <b-button
      v-for="(entity, index) in allRelatedEntities"
      :key="index"
      :img="entityPreview(entity.id)"
      :disabled="!fetched"
      :pressed="selected === entity.id"
      :data-qa="`pin item to entity choice ${index}`"
      @click="selectEntity(entity.id)"
    >
      <span>{{ entity.prefLabel.en }}</span>
      <span
        v-if="selected === entity.id"
        class="icon-check-circle d-inline-flex"
      />
      <span
        v-if="pinnedTo(entity.id)"
        class="icon-push-pin d-inline-flex"
      />
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
        :disabled="!selected"
        variant="primary"
        data-qa="toggle pin button"
        @click="togglePin"
      >
        {{ selectedIsPinned ? $t('entity.actions.unpin') : $t('entity.actions.pin') }}
      </b-button>
    </div>
  </b-modal>
</template>

<script>
  import pick from 'lodash/pick';
  import { mapGetters, mapState } from 'vuex';
  import makeToastMixin from '@/mixins/makeToast';

  export default {
    name: 'PinModal',

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
      ...mapGetters({
        itemId: 'item/id',
        entityPreview: 'item/entityPreview',
        featuredSetIds: 'item/featuredSetIds',
        pinnedTo: 'item/pinnedTo'
      }),
      ...mapState({
        allRelatedEntities: state => state.item.allRelatedEntities
      })
    },

    methods: {
      fetchPinningData() {
        console.log('in fetch pinning data');
        // should this attempt to use the entities already present in related entities, so as to not need to query for them again?
        return this.$apis.entity.find(this.entities)
          .then(entities => entities.map(entity => pick(entity, ['id', 'prefLabel', 'isShownBy', 'logo'])))
          .then(async(reduced) => {
            await this.$store.commit('item/setAllRelatedEntities', reduced);
            const entityIds = reduced.map(entity => entity.id);
            console.log(entityIds);
            await this.fetchFeaturedSetData(entityIds); // awaiting here to ensure pins are set before rendering each button's pinned icon.
          })
          .then(() => {
            this.fetched = true;
          });
      },

      async fetchFeaturedSetData(entityIds) {
        // TODO: reduce cognitive complexity in this method?
        console.log('in fetchFeaturedSetIds');
        console.log(entityIds);
        const searchParams = {
          query: 'type:EntityBestItemsSet',
          profile: 'itemDescriptions'
        };
        for (const entityId of entityIds) { // maybe, it'd be nicer to "OR" the ids, but doesn't seem supported. So loop here. On the plus side this enables fetching specific sets only by passing a subset of entityIds
          console.log(entityId);
          searchParams.qf = `subject:${entityId}`;
          await this.$apis.set.search(searchParams)
            .then(async(searchResponse) => {
              console.log(searchResponse);
              if (searchResponse.data?.total > 0) {
                console.log(searchResponse.data.items[0].id.split('/').pop());
                const setId = searchResponse.data.items[0].id.split('/').pop();
                this.$store.commit('item/addToFeaturedSetIds', {
                  entityUri: searchResponse.data.items[0].subject[0],
                  setId
                });
                if (searchResponse.data.items[0].pinned) {
                  const pinnedItemIds = searchResponse.data.items[0].items.map(item => item.id).slice(0, searchResponse.data.items[0].pinned);  // why slice here?
                  console.log('pinnedItemIds:');
                  console.log(pinnedItemIds);
                  this.$store.commit('item/addToFeaturedSetPins', {
                    entityUri: entityId,
                    pins: pinnedItemIds
                  });
                } else {
                  console.log('setting empty pins');
                  this.$store.commit('item/addToFeaturedSetPins', {
                    entityUri: entityId,
                    pins: []
                  });
                }
              }
            });
        }
      },

      ensureSelectedSetExists() {
        console.log(this.featuredSetIds[this.selected]);
        if (this.featuredSetIds[this.selected] === undefined) {
          console.log('set id was undefined');
          const prefLabel = this.allRelatedEntities.find(entity => entity.id === this.selected).prefLabel.en;
          const featuredSetBody = {
            type: 'EntityBestItemsSet',
            title: { 'en': prefLabel + ' Page' },
            subject: [this.selected]
          };
          return this.$apis.set.create(featuredSetBody)
            .then(response => this.$store.commit('item/addToFeaturedSetIds', { entityUri: this.selected, setId: response.id }));
        }
      },

      async pin() {
        console.log(`in pin: ${this.selected}`);
        await this.ensureSelectedSetExists();
        console.log('about to send pin request to set api');
        this.$apis.set.modifyItems('add', this.featuredSetIds[this.selected], this.itemId, true)
          .then(() => this.$store.commit('item/addPinToFeaturedSetPins', {
            entityUri: this.selected,
            pin: this.itemId
          }))
          .then(() => {
            this.hide(); // should the box stay open?
            this.makeToast(this.$t('entity.notifications.pinned'));
          })
          .catch((e) => {
            console.log(e);
            if (e.message === 'too many pins') {
              this.hide();
              this.$bvModal.show(`pinned-limit-modal-${this.itemId}`);
            } else {
              throw e;
            }
          });
      },
      async unpin() {
        await this.$apis.set.modifyItems('delete', this.featuredSetIds[this.selected], this.itemId)
          .then(() =>  {
            this.fetchFeaturedSetData([this.selected]);
          })
          .catch((e) => {
            this.fetchFeaturedSetData([this.selected]); // not sure if refetching makes sense here.
            throw e;
          });
        this.hide(); // should the box stay open?
        const msg = this.$store.state.sanitised.page === 1 ?  this.$t('entity.notifications.unpinnedFirstPage') : this.$t('entity.notifications.unpinned');
        this.makeToast(msg);
      },
      selectEntity(id) {
        // we could re-fetch the sets/pins at this point, but it seems overkill at the moment.
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
