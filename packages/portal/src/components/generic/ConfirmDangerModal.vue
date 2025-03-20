<template>
  <b-modal
    :id="modalId"
    v-model="show"
    :title="modalTitle"
    :static="modalStatic"
    hide-header-close
    hide-footer
  >
    <p v-if="promptText">
      {{ promptText }}
    </p>
    <b-form
      @submit.stop.prevent="handleConfirm"
    >
      <div class="modal-footer">
        <b-button
          variant="outline-primary"
          data-qa="cancel button"
          @click="handleCancel"
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
  export default {
    name: 'ConfirmDangerModal',

    props: {
      cancelButtonText: {
        type: String,
        default: null
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

      value: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        show: this.value
      };
    },

    watch: {
      value() {
        this.show = this.value;
      },

      show() {
        this.$emit('input', this.show);
      }
    },

    methods: {
      handleConfirm() {
        this.hide();
        this.$emit('confirm');
      },

      handleCancel() {
        this.hide();
        this.$emit('cancel');
      },

      hide() {
        this.show = false;
      }
    }
  };
</script>
