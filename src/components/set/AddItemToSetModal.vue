<template>
  <b-modal
    :id="modalId"
    :title="$t('set.actions.addTo')"
    hide-footer
    hide-header-close
    :static="modalStatic"
    @show="fetchCollections"
    @hide="hideModal()"
  >
    <b-button
      variant="primary"
      class="btn-collection w-100 mb-3 text-left p-3"
      data-qa="create new gallery button"
      @click="$emit('clickCreateSet')"
    >
      {{ $t('set.actions.createNew') }}
    </b-button>
    <div class="collections">
      <AddItemToSetButton
        v-for="(collection, index) in collections"
        :key="index"
        :set="collection"
        :img="collectionPreview(collection.id)"
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
  import { BASE_URL as EUROPEANA_DATA_URL } from '@/plugins/europeana/data';

  import AddItemToSetButton from './AddItemToSetButton';

  export default {
    name: 'AddItemToSetModal',

    components: {
      AddItemToSetButton
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
        fetched: false,
        added: []
      };
    },

    computed: {
      collections() {
        return this.$store.state.set.creations;
      },
      // Array of IDs of sets containing the item
      collectionsWithItem() {
        return this.collections
          .filter(collection => (collection.items || []).includes(`${EUROPEANA_DATA_URL}/item${this.itemId}`))
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
      fetchCollections() {
        this.$store.dispatch('set/fetchCreations')
          .then(() => {
            this.fetched = true;
          });
      },

      hideModal() {
        this.$nextTick(() => {
          this.fetched = false;
          this.added = [];
          this.$emit('hideModal');
        });
      },

      collectionPreview(setId) {
        return this.$store.getters['set/creationPreview'](setId);
      },

      addItem(setId) {
        this.$store.dispatch('set/addItem', { setId, itemId: this.itemId });
      },

      removeItem(setId) {
        this.$store.dispatch('set/removeItem', { setId, itemId: this.itemId });
      },

      toggleItem(setId) {
        if (this.collectionsWithItem.includes(setId)) {
          this.added = this.added.filter(id => id !== setId);
          this.removeItem(setId);
        } else {
          this.added.push(setId);
          this.addItem(setId);
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .btn-primary.btn-collection {
    border: 0;
    font-size: 1rem;
    line-height: 1.5;
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
