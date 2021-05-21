<template>
  <b-modal
    :id="modalId"
    :title="title"
    hide-footer
    hide-header-close
    :static="modalStatic"
    @show="init"
  >
    {{ description }}
    <div class="modal-footer">
      <b-button
        variant="outline-primary"
        data-qa="cancel button"
        @click="hide"
      >
        {{ $t('entity.actions.cancel') }}
      </b-button>
      <b-button
        variant="primary"
        data-qa="toggle pin button"
        @click="togglePin"
      >
        {{ pinned ? $t('entity.actions.unpin') : $t('entity.actions.pin') }}
      </b-button>
    </div>
  </b-modal>
</template>

<script>
  export default {
    name: 'PinModal',

    props: {
      modalId: {
        type: String,
        default: 'pin-modal'
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
      makeToast(toastMsg) {
        this.$root.$bvToast.toast(toastMsg, {
          toastClass: 'brand-toast',
          toaster: 'b-toaster-bottom-left',
          autoHideDelay: 5000,
          isStatus: true,
          noCloseButton: true,
          solid: true
        });
      },
      async pin() {
        if (this.$store.state.entity.featuredSetId === null) {
          await this.$store.dispatch('entity/createFeaturedSet');
        }
        try {
          await this.$store.dispatch('entity/pin', this.itemId);
          this.hide();
          this.makeToast(this.$t('entity.notifications.pinned'));
        } catch (e) {
          if (e.message === 'too many pins') {
            this.hide();
            this.$bvModal.show(`pinned-limit-modal-${this.itemId}`);
          } else {
            throw e;
          }
        }
      },
      async unpin() {
        await this.$store.dispatch('entity/unpin', this.itemId);
        this.hide();
        this.makeToast(this.$t('entity.notifications.unpinned'));
      },
      togglePin() {
        this.pinned ? this.unpin() : this.pin();
      },
      hide() {
        this.$bvModal.hide(this.modalId);
      }

    }
  };
</script>
