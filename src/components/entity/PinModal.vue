<template>
  <b-modal
    :id="modalId"
    :title="pinned ? $t('entity.actions.unpin') : $t('entity.actions.pin')"
    hide-footer
    hide-header-close
    :static="modalStatic"
  >
    {{ pinned ? $t('entity.prompts.unpin', { entity: $store.getters['entity/englishPrefLabel'] }) :
      $t('entity.prompts.pin', { entity: $store.getters['entity/englishPrefLabel'] }) }}
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
        description: '',
        buttonLabel: ''
      };
    },

    methods: {
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
          const msg = this.$store.state.sanitised.page === 1 ?  this.$t('entity.notifications.pinnedFirstPage') : this.$t('entity.notifications.pinned');
          this.makeToast(msg);
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
        const msg = this.$store.state.sanitised.page === 1 ?  this.$t('entity.notifications.unpinnedFirstPage') : this.$t('entity.notifications.unpinned');
        this.makeToast(msg);
      },
      async togglePin() {
        if (this.pinned) {
          await this.unpin();
        } else {
          await this.pin();
        }
      },
      hide() {
        this.$bvModal.hide(this.modalId);
      }

    }
  };
</script>
