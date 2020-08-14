<template>
  <!-- TODO: move texts to translations -->
  <b-modal
    id="modal-collection"
    hide-header
    hide-footer
  >
    <SetForm
      v-if="showForm"
    />
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
          v-for="(collection, index) in collections"
          :key="index"
          variant="overlay"
          class="btn-collection w-100 text-left"
        >
          {{ collection.name }} {{ collection.count }} items
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

    components: {
      SetForm: () => import('../set/SetForm')
    },

    props: {
      collections: {
        type: Array,
        default: () => []
      }
    },

    data() {
      return {
        showForm: false
      };
    },

    mounted() {
      this.$root.$on('bv::modal::hidden', () => {
        this.showForm = false;
      });
    },

    methods: {
      createCollection() {
        this.showForm = true;
      },

      cancelModal() {
        this.$nextTick(() => {
          this.$bvModal.hide('modal-collection');
        });
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
