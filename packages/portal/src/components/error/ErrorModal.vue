<template>
  <b-modal
    :id="modalId"
    :title="title"
    :static="modalStatic"
    hide-header-close
    hide-footer
    @hide="handleHide"
  >
    <p
      v-show="description"
    >
      {{ description }}
    </p>
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
    name: 'ErrorModal',

    props: {
      modalId: {
        type: String,
        default: 'error-modal'
      },

      modalStatic: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        error: null
      };
    },

    fetch() {
      this.$root.$on(`show-${this.modalId}`, (error) => {
        this.error = error;
        this.$bvModal.show(this.modalId);
      });
    },

    computed: {
      description() {
        return this.error?.description;
      },
      title() {
        return this.error?.title;
      }
    },

    methods: {
      handleHide() {
        this.error = null;
        this.$emit('accept');
      }
    }
  };
</script>
