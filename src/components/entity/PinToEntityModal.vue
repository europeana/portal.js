<template>
  <b-modal
    id="pinModal"
    :title="$t('entity.actions.pin')"
    hide-footer
    hide-header-close
    :static="modalStatic"
    @hide="hideModal()"
  >
   <p>{{ $t('entity.prompts.pin') }}</p>
   <b-form @submit.stop.prevent="submitForm">
      <div class="modal-footer">
        <b-button
          variant="outline-primary"
          data-qa="cancel button"
          @click="cancel"
        >
          {{ $t('actions.cancel') }}
        </b-button>
        <b-button
          variant="primary"
          type="submit"
          data-qa="pin to entity button"
        >
          {{ $t('entity.actions.pin') }}
        </b-button>
      </div>
    </b-form>
  </b-modal>
</template>

<script>
  export default {
    name: 'pinToEntityModal',

    props: {
      itemId: {
        type: String,
        required: true
      },

      modalStatic: {
        type: Boolean,
        default: false
      },
      newFeatureSetCreated: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
      };
    },

    computed: {
    },

    methods: {

      hideModal() {

      }
    }
  };
</script>
