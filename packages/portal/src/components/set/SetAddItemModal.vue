<template>
  <b-modal
    :id="modalId"
    :title="$t('set.actions.addTo')"
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
      class="collections"
    >
      <SetAddItemButton
        v-for="(collection, index) in collections"
        :key="index"
        :set="collection"
        :img="collectionPreview(collection)"
        :disabled="!fetched"
        :added="added.includes(collection.id)"
        :checked="collectionsWithItem.includes(collection.id)"
        :data-qa="`toggle item button ${index}`"
        @toggle="toggleItem(collection.id)"
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
  import SetAddItemButton from './SetAddItemButton';

  export default {
    name: 'SetAddItemModal',

    components: {
      SetAddItemButton
    },

    props: {
      itemId: {
        type: String,
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

    data() {
      return {
        collections: [],
        fetched: false,
        added: []
      };
    },

    computed: {
      // Array of IDs of sets containing the item
      collectionsWithItem() {
        return this.collections
          .filter(collection => (collection.items || []).some(item => item.id === this.itemId))
          .map(collection => collection.id);
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
        const creator = this.$store.state.keycloak.profile?.id;
        // TODO: pagination and/or search within one's collections
        const searchParams = {
          query: `creator:${creator}`,
          profile: 'standard',
          pageSize: 100,
          page: 0,
          qf: [
            'type:Collection'
          ]
        };

        const searchResponse = await this.$apis.set.search(searchParams, { withMinimalItemPreviews: true });
        this.collections = searchResponse.data.items || [];
        this.fetched = true;
      },

      hideModal() {
        this.$nextTick(() => {
          this.fetched = false;
          this.added = [];
          this.$emit('hideModal');
        });
      },

      collectionPreview(set) {
        return this.$apis.thumbnail.edmPreview(set.items?.[0]?.edmPreview?.[0]);
      },

      async toggleItem(setId) {
        try {
          if (this.collectionsWithItem.includes(setId)) {
            await this.$store.dispatch('set/removeItem', { setId, itemId: this.itemId });
            this.added = this.added.filter(id => id !== setId);
          } else {
            await this.$store.dispatch('set/addItem', { setId, itemId: this.itemId });
            this.added.push(setId);
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
  max-height: calc(100vh - 474px);
  overflow: auto;

  .btn-collection {
    font-weight: 600;
  }

  .btn-collection:last-child {
    margin-bottom: 0;
  }
}
</style>
