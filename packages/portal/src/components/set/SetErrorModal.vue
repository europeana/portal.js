<template>
  <b-modal
    :id="modalId"
    :title="$t('errorMessage.setLocked.title')"
    :static="modalStatic"
    hide-header-close
    hide-footer
    @hide="$emit('accept')"
  >
    <p>{{ $t("errorMessage.setLocked.description") }}</p>
    <div class="modal-footer">
      <b-button
        variant="outline-primary"
        data-qa="close button"
        @click="hide"
      >
        {{ $t('actions.close') }}
      </b-button>
    </div>
  </b-modal>
</template>

<script>
  export default {
    name: 'SetErrorModal',

    props: {
      modalId: {
        type: String,
        default: 'set-error-modal'
      },

      modalStatic: {
        type: Boolean,
        default: false
      }
    },

    methods: {
      hide() {
        this.$bvModal.hide(this.modalId);
      }
    }
  };
</script>
