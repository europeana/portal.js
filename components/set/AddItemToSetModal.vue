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
        class="btn-collection w-100 text-left"
        @click="addItem(collection.id)"
      >
        <span>{{ displayField(collection, 'title') }} ({{ collection.visibility }}) - {{ $tc('items.itemCount', collection.total || 0) }}</span>
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

    mounted() {
      this.$root.$on('bv::modal::hidden', () => {
        this.showForm = false;
      });
    },

    methods: {
      async fetchCollections() {
        const searchParams = {
          query: `creator:${this.$auth.user.sub}`,
          profile: 'itemDescriptions'
        };

        const searchResponse = await this.$sets.search(searchParams);
        this.collections = searchResponse.data.items || [];
      },
      hideModal() {
        this.$nextTick(() => {
          this.$bvModal.hide(this.modalId);
        });
      },

      async addItem(setId) {
        // TODO: error handling
        this.$sets.modifyItems('add', setId, this.itemId)
          .then(() => {
            this.$bvToast.show('new-collection-toast');
            this.hideModal();
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
