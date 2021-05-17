<template>
  <b-modal
    :id="modalId"
    :title="title"
    hide-footer
    hide-header-close
    :static="modalStatic"
    @show="init"
  >
    <p>{{ description }}</p>
    <b-form @submit.stop.prevent="pinned ? unpin : pin">
      <div class="modal-footer">
        <b-button
          variant="outline-primary"
          data-qa="cancel button"
          @click="$bvModal.hide(modalId)"
        >
          {{ $t('entity.actions.cancel') }}
        </b-button>
        <b-button
          variant="primary"
          type="submit"
          data-qa="pin to entity button"
        >
          {{ pinned ? $t('entity.actions.unpin') : $t('entity.actions.pin') }}
        </b-button>
      </div>
    </b-form>
  </b-modal>
</template>

<script>
  export default {
    name: 'PinToEntityModal',

    props: {
      modalId: {
        type: String,
        default: 'pin-to-entity-modal'
      },
      modalStatic: {
        type: Boolean,
        default: false
      },
      itemId: {
        type: String,
        required: true
      },
      pinned: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        title: '',
        description: ''
      };
    },

    methods: {
      init() {
        if (this.pinned) {
          this.title = this.$t('entity.actions.unpin');
          this.description = this.$t('entity.prompts.unpin', { entity: this.$store.getters['entity/englishPrefLabel'] });
        } else {
          this.title = this.$t('entity.actions.pin');
          this.description = this.$t('entity.prompts.pin', { entity: this.$store.getters['entity/englishPrefLabel'] });
        }
      },
      async pin() {
        if (this.$store.getters['entity/featureSetId'] === null) {
          await this.$store.dispatch('entity/createFeatureSet', this.itemId);
        }

        try {
          await this.$store.dispatch('entity/pin', this.itemId);
          this.$emit('pin', this.itemId);
        } catch (e) {
          if (e.message === '24 pins') {
            this.hide();
            this.$bvModal.show(`feature-limit-modal-${this.itemId}`);
          } else {
            throw e;
          }
        }
      },
      async unpin() {
        await this.$store.dispatch('entity/unpin', this.itemId);
      }
    }
  };
</script>
