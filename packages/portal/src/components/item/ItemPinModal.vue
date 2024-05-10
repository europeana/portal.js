<template>
  <b-modal
    :id="modalId"
    :title="$t('record.actions.pin')"
    hide-footer
    hide-header-close
    :static="modalStatic"
    @show="fetchEntityBestItemsSets"
  >
    <b-button
      v-for="(entity, index) in entities"
      :key="index"
      :disabled="!fetched"
      :pressed="selected === entity.id"
      :data-qa="`pin item to entity choice`"
      class="btn-collection w-100 text-left d-flex"
      @click="selectEntity(entity.id)"
    >
      <span
        class="mr-auto"
        :lang="langAttribute(entityDisplayLabel(entity).code)"
      >
        {{ entityDisplayLabel(entity).values[0] }}
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
          class="icon-pin d-inline-flex"
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
          :to="localePath(selectedLink)"
          variant="primary"
        >
          {{ $t('entity.actions.viewPinned') }}
        </b-button>
      </span>
    </div>
  </b-modal>
</template>

<script>
  import pick from 'lodash/pick.js';

  import entityBestItemsSetMixin from '@/mixins/europeana/entities/entityBestItemsSet';
  import langAttributeMixin from '@/mixins/langAttribute';
  import makeToastMixin from '@/mixins/makeToast';
  import { langMapValueForLocale } from '@europeana/i18n/src/langMap.js';

  export default {
    name: 'ItemPinModal',

    mixins: [
      makeToastMixin,
      langAttributeMixin,
      entityBestItemsSetMixin
    ],

    props: {
      /**
       * Identifier of the item
       */
      identifier: {
        type: String,
        required: true
      },
      /**
       * URIs of entities to which item may be pinned
       */
      entityUris: {
        type: Array,
        required: true
      },
      modalId: {
        type: String,
        default: 'pin-modal'
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
        entities: [],
        fetched: false,
        selected: null,
        /**
         * EntityBestItemsSet-type sets for the item's entities
         * @example
         *   {
         *     'entityUri1': { id: 'setId1', pinned: ['itemUri1'] },
         *     'entityUri2': { id: 'setId2', pinned: ['itemUri1', 'itemUri2'] },
         *   }
         */
        sets: []
      };
    },

    computed: {
      infoText() {
        if (this.selectedIsFull) {
          return this.selectedIsPinned ? this.$t('entity.notifications.unpin', { entity: this.selectedEntityPrefLabelValue }) : this.$t('entity.notifications.pinLimit.body');
        }
        if (this.selectedIsPinned) {
          return this.$t('entity.notifications.unpin', { entity: this.selectedEntityPrefLabelValue });
        }
        return this.selected ? this.$t('entity.notifications.pin', { entity: this.selectedEntityPrefLabelValue }) : this.$t('entity.notifications.select');
      },
      selectedIsPinned() {
        return this.selected && this.pinnedTo(this.selected);
      },
      selectedIsFull() {
        return this.selected && this.selectedEntitySet?.pinned?.length >= 24;
      },
      selectedLink() {
        return { name: 'set-all', params: { pathMatch: this.selected && this.selectedEntitySet.id.replace('http://data.europeana.eu/set/', '') } };
      },
      selectedEntityPrefLabel() {
        return this.entityDisplayLabel(this.selectedEntity);
      },
      selectedEntityPrefLabelValue() {
        return this.selectedEntityPrefLabel?.values?.[0];
      },
      selectedEntity() {
        return this.entities.find((entity) => entity.id === this.selected);
      },
      selectedEntitySet() {
        return this.sets[this.selected];
      }
    },

    methods: {
      setFactory() {
        return {
          id: null,
          pinned: []
        };
      },

      async fetchEntityBestItemsSets() {
        if (this.fetched) {
          return;
        }

        // Fetch the full entities first
        const entities = await this.$apis.entity.find(this.entityUris);
        this.entities = entities.map((entity) => pick(entity, 'id', 'prefLabel'));

        const searchParams = {
          query: 'type:EntityBestItemsSet',
          profile: 'minimal',
          pageSize: 1
        };
        await Promise.all(this.entities.map(async(entity) => {
          const entityUri = entity.id;
          // TODO: "OR" the ids to avoid multiple requests, but doesn't seem supported.
          const searchResponse = await this.$apis.set.search({
            ...searchParams,
            qf: `subject:${entityUri}`
          });

          if (searchResponse?.total > 0) {
            await this.getOneSet(searchResponse.items?.[0].split('/').pop());
          }
          // TODO: Should an else block actually be RESETTING the data to empty values?
        }));

        this.fetched = true;
      },

      async getOneSet(setId) {
        const options = {
          profile: 'standard',
          pageSize: 100
        };
        const response = await this.$apis.set.get(setId, options);
        const entityUri = response.subject[0];
        this.sets[entityUri] = {
          id: setId,
          // When pins exist, they need to be sliced from the items, as sets may in future contain recommended items too.
          pinned: (response.items || []).map(item => item.replace('http://data.europeana.eu/item', '')).slice(0, response.pinned)
        };
      },

      async pin() {
        this.selectedEntitySet.id = await this.ensureEntityBestItemsSetExists(this.selectedEntitySet?.id, this.selectedEntity);
        await this.pinItemToEntityBestItemsSet(this.identifier, this.selectedEntitySet.id, this.selectedEntityPrefLabelValue);
        this.selectedEntitySet.pinned.push(this.identifier);
        this.hide();
      },

      async unpin() {
        await this.unpinItemFromEntityBestItemsSet(this.identifier, this.selectedEntitySet.id);
        this.selectedEntitySet.pinned = this.selectedEntitySet.pinned.filter(itemId => itemId !== this.identifier);
        this.hide();
      },

      entityDisplayLabel(entity) {
        return langMapValueForLocale(entity?.prefLabel, this.$i18n.locale);
      },

      selectEntity(id) {
        this.selected = id;
      },

      pinnedTo(entityUri) {
        return this.sets[entityUri]?.pinned?.includes(this.identifier);
      },

      async togglePin() {
        try {
          await (this.selectedIsPinned ? this.unpin() : this.pin());
          this.hide();
        } catch (error) {
          this.$error(error, { scope: error.statusCode === 404 ? 'pinning' : 'gallery' });
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
  @import '@europeana/style/scss/variables';

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
      &.icon-pin {
        margin-left: auto;
        font-size: $font-size-large;
      }
    }
  }
</style>
