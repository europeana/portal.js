<template>
  <b-modal
    :id="modalId"
    :title="$t('set.actions.addTo')"
    hide-footer
    @show="fetchCollections"
  >
    <b-button
      variant="primary"
      class="btn-collection w-100 mb-3 text-left"
      @click="$emit('clickCreateSet')"
    >
      {{ $t('set.actions.createNew') }}
    </b-button>
    <div class="collections">
      <b-button
        v-for="(collection, index) in collections"
        :key="index"
        :style="buttonBackground($sets.getSetThumbnail(collection))"
        variant="overlay"
        class="btn-collection w-100 text-left d-flex justify-content-between align-items-center"
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
        @click="hideModal()"
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
      }
    },

    data() {
      return {
        collections: []
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

    mounted() {
      this.$root.$on('bv::modal::hidden', () => {
        this.showForm = false;
      });
    },

    methods: {
      async fetchCollections() {
        const searchParams = {
          query: `creator:${this.$auth.user.sub}`,
          profile: 'itemDescriptions',
          pageSize: 100 // TODO: pagination?
        };

        const searchResponse = await this.$sets.search(searchParams);
        this.collections = searchResponse.data.items || [];
      },

      hideModal() {
        this.$nextTick(() => {
          this.$bvModal.hide(this.modalId);
        });
      },

      toggleItem(setId) {
        if (this.collectionsWithItem.includes(setId)) {
          this.removeItem(setId);
        } else {
          this.addItem(setId);
        }
      },

      addItem(setId) {
        // TODO: error handling
        this.$sets.modifyItems('add', setId, this.itemId)
          .then(() => {
            this.$bvToast.show('new-collection-toast');
            this.hideModal();
            this.$emit('add', setId, this.itemId);
          });
      },

      removeItem(setId) {
        this.$sets.modifyItems('delete', setId, this.itemId)
          .then(() => {
            this.fetchCollections();
            this.$emit('remove', setId, this.itemId);
          });
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
        if (!img) return null;
        return {
          'background-image': `url("${img}")`
        };
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import './assets/scss/variables.scss';

  .btn-collection {
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    padding: 1rem;
    position: relative;
    text-transform: none;

    &.btn-overlay {
      span {
        position: relative;
        z-index: 10;
        &.icon-check_circle {
          font-size: $font-size-large;
        }
      }

      &:after {
        content: '';
        background: rgba(0, 0, 0, 0.7);
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
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
