<template>
  <b-modal
    :id="modalId"
    :title="$t('errorMessage.setMaintenance.title')"
    :static="modalStatic"
    hide-header-close
    hide-footer
  >
    <p>{{ $t("errorMessage.setMaintenance.description") }}</p>
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
    }
  };
</script>
