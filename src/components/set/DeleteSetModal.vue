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
  import makeToastMixin from '@/mixins/makeToast';

  export default {
    name: 'DeleteSetModal',

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
      // TODO: error handling
      async submitForm() {
        await this.$store.dispatch('set/deleteSet', this.setId);

        this.makeToast(this.toastMsg);
        this.hide();
        // redirect away from deleted set page
        if (this.setId.endsWith(`/${this.$route?.params?.pathMatch}`)) {
          const path = this.$path({ name: 'account' });
          this.$goto(path);
        }
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
