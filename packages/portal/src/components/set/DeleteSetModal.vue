<template>
  <div>
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
    <SetErrorModal
      modalId="set-error-modal-delete"
      @cancel="show"
    />
  </div>
</template>

<script>
  import makeToastMixin from '@/mixins/makeToast';
  import SetErrorModal from '@/components/set/SetErrorModal';

  export default {
    name: 'DeleteSetModal',

    components: {
      SetErrorModal
    },

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
          await this.$store.dispatch('set/delete', this.setId);

          this.makeToast(this.toastMsg);
          this.hide();
          // redirect away from deleted set page
          if (this.$route.name.startsWith('galleries-all___')) {
            this.$goto(this.$path({ name: 'account' }));
          }
        } catch (error) {
          if (error.statusCode === 423) {
            this.$bvModal.hide(this.modalId);
            this.$bvModal.show('set-error-modal-delete');
          } else {
            throw error;
          }
        }
      },

      handleClickCancelButton() {
        this.hide();
        this.$emit('cancel');
      },

      hide() {
        this.$bvModal.hide(this.modalId);
      },

      show() {
        this.$bvModal.show(this.modalId);
      },
    }
  };
</script>
