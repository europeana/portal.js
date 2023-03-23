<template>
  <b-modal
    :id="modalId"
    :title="title"
    :static="modalStatic"
    hide-header-close
    hide-footer
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
      modalStatic: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        modalId: 'error-modal'
      };
    },

    computed: {
      error() {
        return this.$store.state.error.error;
      },
      description() {
        return this.error?.i18n?.description;
      },
      title() {
        return this.error?.i18n?.title;
      }
    },

    watch: {
      error: {
        deep: true,
        handler() {
          if (!this.error.isFetchError && this.error.i18n?.title) {
            this.$bvModal.show(this.modalId);
          }
        }
      }
    }
  };
</script>
