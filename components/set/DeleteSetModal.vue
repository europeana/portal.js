<template>
  <b-modal
    :id="modalId"
    :title="$t('set.actions.delete')"
    :static="modalStatic"
    hide-footer
  >
    <p>{{ $t('set.prompts.delete') }}</p>
    <b-form @submit.stop.prevent="submitForm">
      <div class="modal-footer">
        <b-button
          variant="outline-primary"
          data-qa="close button"
          @click="goBack"
        >
          {{ $t('actions.goBack') }}
        </b-button>
        <b-button
          variant="danger"
          type="submit"
          data-qa="delete button"
        >
          {{ $t('set.actions.delete') }}
        </b-button>
      </div>
    </b-form>
  </b-modal>
</template>

<script>
  export default {
    name: 'DeleteSetModal',

    props: {
      setId: {
        type: String,
        required: true
      },

      modalId: {
        type: String,
        default: 'delete-set-modal'
      },

      modalStatic: {
        type: Boolean,
        default: false
      }
    },

    methods: {
      makeToast() {
        this.$root.$bvToast.toast(this.$t('set.notifications.deleted'), {
          toastClass: 'brand-toast',
          toaster: 'b-toaster-bottom-left',
          autoHideDelay: 5000,
          isStatus: true,
          noCloseButton: true,
          solid: true
        });
      },

      // TODO: error handling
      submitForm() {
        this.$sets.deleteSet(this.setId)
          .then(response => {
            this.makeToast();
            this.hide();
            this.$emit('delete', response);
          });
      },

      goBack() {
        this.hide();
        this.$emit('cancel');
      },

      hide() {
        this.$bvModal.hide(this.modalId);
      }
    }
  };
</script>
