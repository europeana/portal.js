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
      <span class="w-100 help">
        <span class="icon icon-info-outline d-inline-flex" />{{ infoText }}
      </span>
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
        <b-button
          data-qa="go to set link"
          :to="$path(selectedLink)"
          variant="primary"
        >
          {{ $t('entity.actions.viewPinned') }}
        </b-button>
      </span>
    </div>
  </b-modal>
</template>

<script>
  import pick from 'lodash/pick';
  import makeToastMixin from '@/mixins/makeToast';

  export default {
    name: 'ItemPinModal',

    mixins: [
      makeToastMixin
    ],

    props: {
      /**
       * Identifier of the item
       */
      identifier: {
        type: String,
        required: true
      },
      modalId: {
        type: String,
        default: 'pin-modal'
      },
      entities: {
        type: Array,
        required: true
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
        selected: null,
        allRelatedEntities: [],
        featuredSetIds: {},
        featuredSetPins: {}
      };
    },

    computed: {
      infoText() {
        if (this.selectedIsFull) {
          return this.selectedIsPinned ? this.$t('entity.notifications.unpin', { entity: this.selectedEntityPrefLabel }) : this.$t('entity.notifications.pinLimit.body');
        }
        if (this.selectedIsPinned) {
          return this.$t('entity.notifications.unpin', { entity: this.selectedEntityPrefLabel });
        }
        return this.selected ? this.$t('entity.notifications.pin', { entity: this.selectedEntityPrefLabel }) : this.$t('entity.notifications.select');
      },
      selectedIsPinned() {
        return this.selected && this.pinnedTo(this.selected);
      },
      selectedIsFull() {
        return this.selected && this.featuredSetPins[this.selected]?.length >= 24;
      },
      selectedLink() {
        return { name: 'set-all', params: { pathMatch: this.selected && this.featuredSetIds[this.selected].replace('http://data.europeana.eu/set/', '') } };
      },
      selectedEntityPrefLabel() {
        return this.allRelatedEntities.find(entity => entity.id === this.selected)?.prefLabel?.en;
      }
    },

    methods: {
      async fetchPinningData() {
        if (this.fetched) {
          return;
        }
        // TODO: Don't fetch all entities if related entities are already present and less than 5. Set all entities to related entities instead for that scenario.
        const entities = await this.$apis.entity.find(this.entities);
        this.allRelatedEntities = entities.map(entity => pick(entity, ['id', 'prefLabel']));
        const entityIds = this.allRelatedEntities.map(entity => entity.id);
        await this.fetchFeaturedSetData(entityIds);
        this.fetched = true;
      },

      async fetchFeaturedSetData(entityIds) {
        const searchParams = {
          query: 'type:EntityBestItemsSet',
          profile: 'minimal',
          pageSize: 1
        };
        await Promise.all(entityIds.map(async(entityId) => {
          // TODO: "OR" the ids to avoid multiple requests, but doesn't seem supported.
          const searchResponse = await this.$apis.set.search({
            ...searchParams,
            qf: `subject:${entityId}`
          });
          if (searchResponse.data?.total > 0) {
            await this.getSetData(searchResponse.data.items[0].split('/').pop());
          }
          // TODO: Should  an else block actually be RESETTING the data to empty values?
        }));
      },

      async getSetData(setId) {
        const options = {
          profile: 'standard',
          pageSize: 100
        };
        const response = await this.$apis.set.get(setId, options);
        const entityUri = response.subject[0];
        this.featuredSetIds[entityUri] = setId;
        let pinnedItemIds = [];
        if (response.pinned) { // When pins exist, they need to be sliced from the items, as sets may in future contain recommended items too.
          pinnedItemIds = response.items.map(item => item.replace('http://data.europeana.eu/item', '')).slice(0, response.pinned);
        }
        this.featuredSetPins[entityUri] = pinnedItemIds;
      },

      async ensureSelectedSetExists() {
        if (!this.featuredSetIds[this.selected]) {
          const featuredSetBody = {
            type: 'EntityBestItemsSet',
            title: { 'en': this.selectedEntityPrefLabel + ' Page' },
            subject: [this.selected]
          };
          const response = await this.$apis.set.create(featuredSetBody);
          const entityUri = response.id;
          this.featuredSetIds[this.selected] = entityUri;
          this.featuredSetPins[entityUri] = []; // Instantiate blank pins on new set
        }
      },

      async pin() {
        await this.ensureSelectedSetExists();
        await this.$apis.set.modifyItems('add', this.featuredSetIds[this.selected], this.identifier, true);
        this.featuredSetPins[this.selected].push(this.identifier); // pin will likely always be state.id
        this.makeToast(this.$t('entity.notifications.pinned', { entity: this.selectedEntityPrefLabel }));
        this.hide(); // TODO: should the modal stay open?
      },

      async unpin() {
        await this.$apis.set.modifyItems('delete', this.featuredSetIds[this.selected], this.identifier);
        // TODO: instead of refetching everything, this could update the local data only.
        await this.fetchFeaturedSetData([this.selected]);
        this.makeToast(this.$t('entity.notifications.unpinned'));
        this.hide(); // TODO: should the modal stay open?
      },

      selectEntity(id) {
        this.selected = id;
      },

      pinnedTo(entityUri) {
        return (this.featuredSetPins[entityUri] || []).includes(this.identifier);
      },

      async togglePin() {
        await (this.selectedIsPinned ? this.unpin() : this.pin());
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

  .help {
    font-size: $font-size-extrasmall;
    color: $mediumgrey;
    display: flex;
    align-items: center;
    margin-bottom: 1.25rem;

    span {
      display: inline-block;
      margin-right: 0.5rem;
    }
  }

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
