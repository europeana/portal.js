<template>
  <b-modal
    :id="modalId"
    :title="modalTitle"
    :static="modalStatic"
    hide-header-close
    hide-footer
  >
    <p>{{ promptText }}</p>
    <b-form @submit.stop.prevent="handleSubmitForm">
      <div class="modal-footer">
        <b-button
          variant="outline-primary"
          data-qa="cancel button"
          @click="handleClickCancelButton"
        >
          {{ cancelButtonText || $t('actions.cancel') }}
        </b-button>
        <b-button
          variant="danger"
          type="submit"
          data-qa="confirm button"
        >
          {{ confirmButtonText || $t('actions.confirm') }}
        </b-button>
      </div>
    </b-form>
  </b-modal>
</template>

<script>
  import useMakeToast from '@/composables/makeToast.js';

  export default {
    name: 'ConfirmDangerModal',

    props: {
      cancelButtonText: {
        type: String,
        default: null
      },

      confirm: {
        type: Function,
        default: () => {}
      },

      confirmButtonText: {
        type: String,
        default: null
      },

      modalId: {
        type: String,
        default: 'confirm-danger-modal'
      },

      modalStatic: {
        type: Boolean,
        default: false
      },

      modalTitle: {
        type: String,
        default: null
      },

      promptText: {
        type: String,
        default: null
      },

      toastMsg: {
        type: String,
        default: null
      }
    },

    setup() {
      const { makeToast } = useMakeToast();
      return { makeToast };
    },

    methods: {
      async handleSubmitForm() {
        await this.confirm();
        this.toastMsg && this.makeToast(this.toastMsg);
        this.hide();
        this.$emit('success');
      },

      handleClickCancelButton() {
        this.hide();
        this.$emit('cancel');
      },

      hide() {
        this.$bvModal.hide(this.modalId);
      }
    }
  };
</script>
