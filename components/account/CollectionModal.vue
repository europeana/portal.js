<template>
  <b-modal
    :id="modalId"
    :title="title"
    hide-footer
    @show="fetchCollections"
  >
    <div v-if="showForm">
      <b-form @submit.stop.prevent="submitForm">
        <b-form-group
          :label="$t('collectionModal.collectionName')"
          label-for="collection"
        >
          <b-form-input
            id="collection"
            v-model="newCollectionName"
            type="text"
            maxlength="35"
            required
          />
        </b-form-group>
        <b-form-group
          :label="$t('collectionModal.collectionDescription')"
          label-for="description"
        >
          <b-form-textarea
            id="description"
            v-model="newCollectionDescription"
            maxlength="240"
            rows="4"
          />
        </b-form-group>
        <b-form-group>
          <b-form-checkbox
            id="visibility"
            v-model="newCollectionPrivate"
          >
            {{ $t('collectionModal.collectionPrivate') }}
          </b-form-checkbox>
        </b-form-group>
        <div class="modal-footer">
          <b-button
            variant="outline-primary"
            @click="goBack()"
          >
            {{ $t('collectionModal.goBack') }}
          </b-button>
          <b-button
            variant="primary"
            type="submit"
          >
            {{ $t('collectionModal.createCollection') }}
          </b-button>
        </div>
      </b-form>
    </div>
    <div v-else>
      <b-button
        variant="primary"
        class="btn-collection w-100 mb-3 text-left"
        @click="createCollection"
      >
        {{ $t('collectionModal.createNewCollection') }}
      </b-button>
      <div class="collections">
        <b-button
          v-for="(collection, index) in collections"
          :key="index"
          :style="buttonBackground($sets.getSetThumbnail(collection))"
          variant="overlay"
          class="btn-collection w-100 text-left"
          @click="toggleItem(collection.id)"
        >
          <span>{{ displayField(collection, 'title') }} ({{ collection.visibility }}) - {{ $tc('items.itemCount', collection.total) }}</span>
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
    </div>
  </b-modal>
</template>

<script>
  export default {
    name: 'CollectionModal',

    props: {
      itemId: {
        type: String,
        required: true
      },

      modalId: {
        type: String,
        default: 'collection-modal'
      }
    },

    data() {
      return {
        showForm: false,
        newCollectionName: '',
        newCollectionDescription: '',
        newCollectionPrivate: false,
        collections: []
      };
    },

    computed: {
      title() {
        return this.showForm ?
          this.$t('collectionModal.createNewCollection') :
          this.$t('collectionModal.addToCollection');
      },

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
      createCollection() {
        this.showForm = true;
      },
      goBack() {
        this.showForm = false;
        this.newCollectionName = '';
        this.newCollectionDescription = '';
        this.newCollectionPrivate = false;
      },
      hideModal() {
        this.$nextTick(() => {
          this.$bvModal.hide(this.modalId);
        });
      },

      submitForm() {
        const setBody = {
          type: 'Collection',
          visibility: this.newCollectionPrivate ? 'private' : 'public',
          title: {},
          description: {}
        };
        setBody.title[this.$i18n.locale] = this.newCollectionName;
        setBody.description[this.$i18n.locale] = this.newCollectionDescription;

        // TODO: error handling
        this.$sets.createSet(setBody)
          .then(() => {
            this.fetchCollections();
            this.goBack();
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
          });
      },

      removeItem(setId) {
        this.$sets.modifyItems('delete', setId, this.itemId)
          .then(() => {
            this.fetchCollections();
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
