<template>
  <b-modal
    :id="modalId"
    :title="$t('set.actions.delete')"
    :static="modalStatic"
    hide-header-close
    hide-footer
  >
    <p>{{ $t('set.prompts.delete') }}</p>
    <b-form @submit.stop.prevent="submitForm">
      <div class="modal-footer">
        <b-button
          variant="outline-primary"
          data-qa="close button"
          @click="handleClickCancelButton"
        >
          {{ $t('actions.cancel') }}
        </b-button>
        <b-button
          variant="danger"
          type="submit"
          data-qa="delete confirmation button"
        >
          {{ $t('set.actions.delete') }}
        </b-button>
      </div>
    </b-form>
  </b-modal>
</template>

<script>
  import makeToastMixin from '@/mixins/makeToast';

  export default {
    name: 'SetDeleteModal',

    mixins: [
      makeToastMixin
    ],

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

    data() {
      return {
        toastMsg: this.$t('set.notifications.deleted')
      };
    },

    methods: {
      // TODO: error handling other statuses
      async submitForm() {
        try {
          await this.$apis.set.delete(this.setId);
          if (this.setId === this.$store.state.set.active?.id) {
            this.$store.dispatch('set/setActive', null);
          }

          this.makeToast(this.toastMsg);
          this.hide();
          // redirect away from deleted set page
          if (this.$route.name.startsWith('galleries-all___')) {
            this.$router.push(this.localePath({ name: 'account' }));
          }
        } catch (e) {
          this.$error(e, { scope: 'gallery' });
        }
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
