<template>
  <b-modal
    id="pinModal"
    :title="$t('entity.actions.pin')"
    hide-footer
    hide-header-close
    :static="modalStatic"
  >
    <p>{{ $t('entity.prompts.pin') }}</p>
    <b-form @submit.stop.prevent="pin">
      <div class="modal-footer">
        <b-button
          variant="outline-primary"
          data-qa="cancel button"
          @click="hideModal"
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
    name: 'PinToEntityModal',

    props: {
      modalStatic: {
        type: Boolean,
        default: false
      }
    },

    methods: {
      async pin() {
        if (this.$store.getters['entity/featureSetId'] === null) {
          await this.$store.dispatch('entity/createFeatureSet');
        }

        try {
          await this.$store.dispatch('entity/pin', this.value);
          this.$emit('pin', this.value);
        } catch (e) {
          if (e.message === '24 pins') {
            this.hide();
            this.$bvModal.show('featureLimitModal');
          } else {
            throw e;
          }
        }
      },

      hideModal() {
        this.hide();
      }
    }
  };
</script>
