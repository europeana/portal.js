<template>
  <b-modal
    :id="modalId"
    hide-header
    hide-footer
    @show="fetchCollections"
  >
    <div v-if="showForm">
      <h1 class="pt-2">
        {{ $t('collectionModal.createNewCollection') }}
      </h1>
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
      <h1 class="pt-2">
        {{ $t('collectionModal.addToCollection') }}
      </h1>
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
          :style="buttonBackground(collection.thumbnail)"
          variant="overlay"
          class="btn-collection w-100 text-left"
          @click="addItem(collection.id)"
        >
          {{ displayField(collection, 'title') }} ({{ collection.visibility }}) - {{ collection.total }} items
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
    name: 'ModalCollection',

    props: {
      itemId: {
        type: String,
        required: true
      },

      modalId: {
        type: String,
        default: 'modal-collection'
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

    mounted() {
      this.$root.$on('bv::modal::hidden', () => {
        this.showForm = false;
      });
    },

    methods: {
      async fetchCollections() {
        const setIds = await this.$sets.getSetsByCreator(this.$auth.user.sub, '', 'minimal');
        const setsNoImage = await this.$sets.getAllSets(setIds);
        this.collections = await this.$sets.getSetImages(setsNoImage);
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
        // TODO: Create set-plugin call for creating a new set
        // TODO: Add this item (its id can be found in the store) to the new set

        // TODO: this should emit an event and allow the parent component to toast
        this.$bvToast.show('new-collection-toast');
        this.newCollectionName = '';
        this.newCollectionDescription = '';
        this.newCollectionPrivate = false;
        this.goBack();
      },

      async addItem(setId) {
        // TODO: Before addind an item to a set, we should check if the set already contains that item
        await this.$sets.modifyItems('add', setId, this.itemId);
        this.hideModal();
      },

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
    text-transform: none;
  }

  .collections {
    max-height: calc(100vh - 474px);
    overflow: auto;

    .btn-collection:last-child {
      margin-bottom: 0;
    }
  }
</style>
