<template>
  <b-modal
    :id="modalId"
    v-model="show"
    :title="modalTitle"
    title-tag="h2"
    :static="modalStatic"
    hide-header-close
    hide-footer
  >
    <template
      v-if="promptTextValues.length > 0"
    >
      <p
        v-for="(text, index) in promptTextValues"
        :key="index"
      >
        {{ text }}
      </p>
    </template>
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
        type: [String, Array],
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

    computed: {
      promptTextValues() {
        return [].concat(this.promptText).filter(Boolean);
      }
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
