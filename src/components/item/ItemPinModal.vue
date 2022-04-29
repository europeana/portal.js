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
      v-for="(set, index) in sets"
      :key="index"
      :disabled="!fetched"
      :pressed="selected === set.subject.id"
      :data-qa="`pin item to entity choice`"
      class="btn-collection w-100 text-left d-flex"
      @click="selectEntity(set.subject.id)"
    >
      <span
        class="mr-auto"
      >
        <!-- TODO: localise here, even if not on the set itself -->
        {{ set.subject.prefLabel.en }}
      </span>
      <span
        class="icons text-left d-flex justify-content-end"
      >
        <span
          v-if="selected === set.subject.id"
          class="icon-check-circle d-inline-flex ml-auto"
        />
        <span
          v-if="pinnedTo(set.subject.id)"
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
        /**
         * @example
         *   [
         *     { id: 'setId1', subject: { id: 'entityUri1', prefLabel: { en: 'entityEnLabel1' } }, pinned: ['itemUri1'] },
         *     { id: 'setId2', subject: { id: 'entityUri2', prefLabel: { en: 'entityEnLabel2' } }, pinned: ['itemUri1', 'itemUri2'] },
         *   ]
         */
        sets: []
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
        return this.selected && this.selectedEntitySet?.pinned?.length >= 24;
      },
      selectedLink() {
        return { name: 'set-all', params: { pathMatch: this.selected && selectedEntitySet.id.replace('http://data.europeana.eu/set/', '') } };
      },
      selectedEntityPrefLabel() {
        return this.selectedEntitySet?.subject?.prefLabel?.en;
      },
      selectedEntitySet() {
        return this.sets.find(set => set.subject.id === this.selected);
      }
    },

    methods: {
      async fetchPinningData() {
        if (this.fetched) {
          return;
        }
        // TODO: Don't fetch all entities if related entities are already present
        //       and less than 5. Set all entities to related entities instead for
        //       that scenario.
        const entities = await this.$apis.entity.find(this.entities);
        this.sets = entities.map(entity => (
          { id: null, subject: { id: entity.id, prefLabel: entity.prefLabel }, pinned: [] }
        ));
        await this.findAllSets();
        this.fetched = true;
      },

      async findAllSets() {
        const searchParams = {
          query: 'type:EntityBestItemsSet',
          profile: 'minimal',
          pageSize: 1
        };
        await Promise.all(this.sets.map(async(set) => {
          const entityId = set.subject.id;
          // TODO: "OR" the ids to avoid multiple requests, but doesn't seem supported.
          const searchResponse = await this.$apis.set.search({
            ...searchParams,
            qf: `subject:${entityId}`
          });
          if (searchResponse.data?.total > 0) {
            await this.getOneSet(searchResponse.data.items[0].split('/').pop());
          }
          // TODO: Should an else block actually be RESETTING the data to empty values?
        }));
      },

      async getOneSet(setId) {
        const options = {
          profile: 'standard',
          pageSize: 100
        };
        const response = await this.$apis.set.get(setId, options);
        const entityUri = response.subject[0];
        const set = this.sets.find(set => set.subject.id === entityUri);
        set.id = setId;
        // When pins exist, they need to be sliced from the items, as sets may in future contain recommended items too.
        set.pinned = (response.items || []).map(item => item.replace('http://data.europeana.eu/item', '')).slice(0, response.pinned);
      },

      async ensureSelectedSetExists() {
        if (!this.selectedEntitySet.id) {
          const setBody = {
            type: 'EntityBestItemsSet',
            title: { 'en': this.selectedEntityPrefLabel + ' Page' },
            subject: [this.selected]
          };
          const response = await this.$apis.set.create(setBody);
          selectedEntitySet.id = response.id;
        }
      },

      async pin() {
        await this.ensureSelectedSetExists();
        await this.$apis.set.modifyItems('add', this.selectedEntitySet.id, this.identifier, true);
        this.selectedEntitySet.pinned.push(this.identifier);
        this.makeToast(this.$t('entity.notifications.pinned', { entity: this.selectedEntityPrefLabel }));
        this.hide();
      },

      async unpin() {
        await this.$apis.set.modifyItems('delete', this.selectedEntitySet.id, this.identifier);
        this.selectedEntitySet.pinned = this.selectedEntitySet.pinned.filter(itemId => itemId !== this.identifier);
        this.makeToast(this.$t('entity.notifications.unpinned'));
        this.hide();
      },

      selectEntity(id) {
        this.selected = id;
      },

      pinnedTo(entityUri) {
        return this.sets.find(set => set.subject.id === entityUri)?.pinned.includes(this.identifier);
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
