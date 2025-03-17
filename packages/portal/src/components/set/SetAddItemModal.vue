<template>
  <b-modal
    :id="modalId"
    :title="modalTitle"
    hide-footer
    hide-header-close
    :static="modalStatic"
    @show="fetchCollections"
    @hide="hideModal"
  >
    <b-button
      variant="primary"
      class="btn-collection w-100 mb-3 text-left p-3"
      data-qa="create new gallery button"
      @click="$emit('clickCreateSet')"
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
        @toggle="toggleItem(collection)"
      />
    </div>
    <div class="modal-footer">
      <b-button
        variant="outline-primary"
        data-qa="close button"
        @click="$bvModal.hide(modalId)"
      >
        {{ $t('actions.close') }}
      </b-button>
    </div>
  </b-modal>
</template>

<script>
  import logEventMixin from '@/mixins/logEvent';
  import { useCardinality } from '@/composables/cardinality.js';
  import useMakeToast from '@/composables/makeToast.js';
  import SetAddItemButton from './SetAddItemButton';
  import { ITEM_URL_PREFIX } from '@/plugins/europeana/data.js';
  import { langMapValueForLocale } from '@europeana/i18n';

  export default {
    name: 'SetAddItemModal',

    components: {
      SetAddItemButton
    },

    mixins: [
      logEventMixin
    ],

    props: {
      itemIds: {
        type: [String, Array],
        required: true
      },
      modalId: {
        type: String,
        default: 'add-item-to-set-modal'
      },
      modalStatic: {
        type: Boolean,
        default: false
      },
      newSetCreated: {
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
        collections: [],
        collectionsWithItem: [],
        fetched: false,
        added: []
      };
    },

    computed: {
      selectionCount() {
        return Array.isArray(this.itemIds) ? this.itemIds.length : false;
      },
      modalTitle() {
        return this.$tc(`set.actions.addItemsHere.${this.cardinality}`, this.selectionCount, { count: this.selectionCount });
      }
    },

    watch: {
      newSetCreated(newVal) {
        if (newVal) {
          this.added.push(this.collectionsWithItem[0]);
        }
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

      hideModal() {
        this.$nextTick(() => {
          this.fetched = false;
          this.added = [];
          this.$emit('hideModal');
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
            this.logEvent('add', [].concat(this.itemIds).map((id) => `${ITEM_URL_PREFIX}${id}`));
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
