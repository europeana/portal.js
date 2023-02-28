<template>
  <b-modal
    :id="modalId"
    :title="$t(`errorMessage.${errorScope}.title`)"
    :static="modalStatic"
    hide-header-close
    hide-footer
    @hide="$emit('accept')"
  >
    <p>{{ $t(`errorMessage.${errorScope}.description`) }}</p>
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
        errorScope: 'unknown'
      };
    },

    fetch() {
      this.$root.$on(`show-${this.modalId}`, (errorScope) => {
        this.errorScope = errorScope;
        this.$bvModal.show(this.modalId);
      });
    }
  };
</script>
