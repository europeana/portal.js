<template>
  <div>
    <b-modal
      v-model="show"
      :static="modalStatic"
      :title="modalTitle"
      hide-footer
      hide-header-close
      @show="fetchCollections"
      @hide="hideModal"
    >
      <b-button
        variant="primary"
        class="btn-collection w-100 mb-3 text-left p-3"
        data-qa="create new gallery button"
        @click="showFormModal = true"
      >
        {{ $t('set.actions.createNew') }}
      </b-button>
      <div
        v-if="collections.length"
        class="collections"
      >
        <SetAddItemButton
          v-for="(collection, index) in collections"
          :key="index"
          :set="collection"
          :disabled="!fetched"
          :added="added.includes(collection.id)"
          :checked="collectionsWithItem.includes(collection.id)"
          :data-qa="`toggle item button ${index}`"
          @click.native="handleClickButton(collection)"
        />
      </div>
      <div class="modal-footer">
        <b-button
          variant="outline-primary"
          data-qa="close button"
          @click="hideModal"
        >
          {{ $t('actions.close') }}
        </b-button>
      </div>
    </b-modal>
    <SetFormModal
      v-if="showFormModal"
      v-model="showFormModal"
      :item-ids="itemIds"
      @input="showFormModal = $event"
    />
    <ConfirmDangerModal
      v-if="showConfirmationModal"
      v-model="showConfirmationModal"
      :confirm-button-text="$t('actions.remove')"
      :modal-id="confirmRemoveModalId"
      :modal-title="confirmRemoveModalTitle"
      :prompt-text="confirmRemoveModalPromptText"
      data-qa="confirm removal modal"
      @confirm="handleRemoveConfirmation"
      @input="showConfirmationModal = $event"
    />
  </div>
</template>

<script>
  import logEventMixin from '@/mixins/logEvent';
  import { useCardinality } from '@/composables/cardinality.js';
  import useMakeToast from '@/composables/makeToast.js';
  import SetFormModal from './SetFormModal';
  import SetAddItemButton from './SetAddItemButton';
  import { ITEM_URL_PREFIX } from '@/plugins/europeana/data.js';
  import { langMapValueForLocale } from '@europeana/i18n';

  export default {
    name: 'SetAddItemModal',

    components: {
      ConfirmDangerModal: () => import('../generic/ConfirmDangerModal'),
      SetAddItemButton,
      SetFormModal
    },

    mixins: [
      logEventMixin
    ],

    props: {
      itemIds: {
        type: [String, Array],
        required: true
      },
      modalStatic: {
        type: Boolean,
        default: false
      },
      newSetCreated: {
        type: Boolean,
        default: false
      },
      value: {
        type: Boolean,
        default: false
      }
    },

    setup(props) {
      const { cardinality } = useCardinality(props.itemIds);
      const { makeToast } = useMakeToast();
      return { cardinality, makeToast };
    },

    data() {
      return {
        added: [],
        collections: [],
        collectionsWithItem: [],
        confirming: null,
        confirmRemoveModalId: 'set-confirm-remove-multiple-items',
        fetched: false,
        show: this.value,
        showConfirmationModal: false,
        showFormModal: false
      };
    },

    computed: {
      confirmRemoveModalPromptText() {
        return this.$tc('set.prompts.removeItems', this.selectionCount, { count: this.selectionCount });
      },
      confirmRemoveModalTitle() {
        return this.$tc('set.actions.removeItems.many', this.selectionCount, { count: this.selectionCount });
      },
      modalTitle() {
        return this.$tc(`set.actions.addItemsHere.${this.cardinality}`, this.selectionCount, { count: this.selectionCount });
      },
      selectionCount() {
        return Array.isArray(this.itemIds) ? this.itemIds.length : 1;
      }
    },

    watch: {
      newSetCreated(newVal) {
        if (newVal) {
          this.added.push(this.collectionsWithItem[0]);
        }
      },
      value() {
        this.show = this.value;
      },
      show() {
        this.$emit('input', this.show);
      }
    },

    methods: {
      async fetchCollections() {
        const searchResponse = await this.$apis.set.search({
          query: `creator:${this.$auth.user?.sub}`,
          profile: 'items.meta',
          pageSize: 100,
          page: 1,
          qf: [
            'type:Collection'
          ]
        });
        this.collections = searchResponse.items || [];
        this.fetched = true;
        this.fetchCollectionsWithItem();
      },

      async fetchCollectionsWithItem() {
        const itemsQueries = [].concat(this.itemIds).map(id => `item:${ITEM_URL_PREFIX}${id}`);
        const searchResponse = await this.$apis.set.search({
          query: `creator:${this.$auth.user?.sub}`,
          profile: 'items',
          pageSize: 100,
          page: 1,
          qf: [
            ...itemsQueries,
            'type:Collection'
          ]
        });
        this.collectionsWithItem = searchResponse.items || [];
      },

      handleClickButton(set) {
        if (this.collectionsWithItem.includes(set.id)) {
          this.confirming = set;
          this.showConfirmationModal = true;
        } else {
          this.toggleItem(set);
        }
      },

      handleRemoveConfirmation() {
        this.toggleItem(this.confirming);
        this.confirming = null;
      },

      hideModal() {
        this.$nextTick(() => {
          this.fetched = false;
          this.added = [];
          this.show = false;
        });
      },

      async toggleItem(set) {
        const setId = set.id;
        const setTitle = langMapValueForLocale(set.title, this.$i18n.locale).values[0];
        try {
          if (this.collectionsWithItem.includes(setId)) {
            await this.$apis.set.deleteItems(setId, this.itemIds);
            this.added = this.added.filter(id => id !== setId);
            this.makeToast(this.$tc(
              `set.notifications.itemsRemoved.${this.cardinality}`, this.selectionCount, { count: this.selectionCount, gallery: setTitle }
            ));
          } else {
            await this.$apis.set.insertItems(setId, this.itemIds);
            // TODO: how to track multi-select - for each?
            if (!Array.isArray(this.itemIds)) {
              this.logEvent('add', `${ITEM_URL_PREFIX}${this.itemIds}`);
            }
            this.added.push(setId);
            this.makeToast(this.$tc(
              `set.notifications.itemsAdded.${this.cardinality}`, this.selectionCount, { count: this.selectionCount, gallery: setTitle }
            ));
          }
        } catch (e) {
          this.$error(e, { scope: 'gallery' });
        }
        this.fetchCollections();
      }
    }
  };
</script>

<style lang="scss" scoped>
@import '@europeana/style/scss/variables';

.btn-primary.btn-collection {
  border: 0;
  font-size: $font-size-base;
  line-height: 1.5;

  @media (min-width: $bp-4k) {
    font-size: $font-size-base-4k;

    &.mb-3 {
      margin-bottom: 1.5rem !important;
    }

    &.p-3 {
      padding: 1.5rem !important;
    }
  }
}

.collections {
  max-height: 10rem;
  overflow: auto;

  @media (min-height: 444px) {
    max-height: calc(100vh - 18rem);
  }

  @media (min-height: $bp-medium) {
    max-height: calc(100vh - 27rem);
  }

  .btn-collection {
    font-weight: 600;
  }

  .btn-collection:last-child {
    margin-bottom: 0;
  }
}
</style>
