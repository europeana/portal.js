<template>
  <!-- TODO: move texts to translations -->
  <b-modal
    id="modal-collection"
    hide-header
    hide-footer
  >
    <div v-if="showForm">
      <h2>Create new collection</h2>
      <b-form @submit.stop.prevent="submitForm">
        <b-form-group
          label="Collection name"
          label-for="collection"
        >
          <b-form-input
            id="collection"
            type="text"
            required
          />
        </b-form-group>
        <b-form-group
          label="Collection description"
          label-for="description"
        >
          <b-form-textarea
            id="collection"
          />
        </b-form-group>
        <div class="modal-footer">
          <b-button
            variant="outline-primary"
            @click="goBack()"
          >
            Go back
          </b-button>
          <b-button
            variant="primary"
            type="submit"
          >
            Create collection
          </b-button>
        </div>
      </b-form>
    </div>
    <div v-else>
      <h2>Add to collection</h2>
      <b-button
        variant="primary"
        class="btn-collection w-100 mb-3 text-left"
        @click="createCollection"
      >
        Create new collection
      </b-button>
      <div class="collections">
        <!-- TODO: these buttons need to get a background image, according to design -->
        <b-button
          variant="overlay"
          class="btn-collection w-100 text-left"
        >
          My first collection (private) - 12 items
        </b-button>
        <b-button
          variant="overlay"
          class="btn-collection w-100 text-left"
        >
          Beautiful flowers (private) - 16 items
        </b-button>
      </div>
      <div class="modal-footer">
        <b-button
          variant="outline-primary"
          @click="cancelModal()"
        >
          Close
        </b-button>
      </div>
    </div>
  </b-modal>
</template>

<script>
  export default {
    name: 'ModalCollection',

     data() {
      return {
        showForm: false
      };
    },

    mounted() {
      this.$root.$on('bv::modal::hidden', (bvEvent, modalId) => {
        this.showForm = false;
      });
    },

    methods: {
      createCollection() {
        this.showForm = true;
      },

      goBack() {
        this.showForm = false;
      },

      cancelModal() {
        this.$nextTick(() => {
          this.$bvModal.hide('modal-collection');
        })
      },

      submitForm() {
        // TODO: submit form + show toast
        // close afterwards
        this.$nextTick(() => {
          this.$bvModal.hide('modal-collection');
          this.showForm = false;
        })
      }
    }
  };
</script>

<style lang="scss" scoped>
  .btn-collection {
    font-size: 1rem;
    margin-bottom: 0.5rem;
    padding: 1rem;
    text-transform: none;
  }

  .collections {
    max-height: calc(100vh - 320px);
    overflow: auto;
  
    .btn-collection:last-child {
      margin-bottom: 0;
    }
  }
</style>

