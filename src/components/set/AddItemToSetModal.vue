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
      class="btn-collection w-100 mb-3 text-left"
      data-qa="create new gallery button"
      @click="$emit('clickCreateSet')"
    >
      {{ $t('set.actions.createNew') }}
    </b-button>
    <div class="collections">
      <b-button
        v-for="(collection, index) in collections"
        :key="index"
        :disabled="!fetched"
        :style="!added.includes(collection.id) && buttonBackground($apis.set.getSetThumbnail(collection))"
        :variant="added.includes(collection.id) ? 'success' : 'overlay'"
        class="btn-collection w-100 text-left d-flex justify-content-between align-items-center"
        :data-qa="`toggle item button ${index}`"
        @click="toggleItem(collection.id)"
      >
        <span>{{ displayField(collection, 'title') }} ({{ collection.visibility }}) - {{ $tc('items.itemCount', collection.total || 0) }}</span>
        <span
          v-if="collectionsWithItem.includes(collection.id)"
          class="icon-check_circle d-inline-flex"
        />
      </b-button>
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
  export default {
    name: 'AddItemToSetModal',

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
          .filter(collection => (collection.items || []).some(item => item.id === this.itemId))
          .map(collection => collection.id);
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

      toggleItem(setId) {
        if (this.collectionsWithItem.includes(setId)) {
          this.added = this.added.filter(id => id !== setId);
          this.removeItem(setId);
        } else {
          this.added.push(setId);
          this.addItem(setId);
        }
      },

      addItem(setId) {
        // TODO: error handling
        this.$store.dispatch('set/addItem', { setId, itemId: this.itemId });
      },

      removeItem(setId) {
        this.$store.dispatch('set/removeItem', { setId, itemId: this.itemId });
      },

      // TODO: use lang map l10n function
      displayField(set, field) {
        if (!set[field]) {
          return '';
        } else if (set[field][this.$i18n.locale]) {
          return set[field][this.$i18n.locale];
        } else {
          return set[field]['en'];
        }
      },

      buttonBackground(img) {
        return img ? { 'background-image': `url("${img}")` } : null;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/variables.scss';

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
      &.icon-check_circle {
        font-size: $font-size-large;
      }
    }
  }

  .collections {
    max-height: calc(100vh - 474px);
    overflow: auto;

    .btn-collection:last-child {
      margin-bottom: 0;
    }
  }
</style>
