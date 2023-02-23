<template>
  <div class="pin-button-wrapper">
    <b-button
      class="pin-button text-uppercase"
      :class="{ 'button-icon-only': !buttonText }"
      :variant="buttonVariant"
      :pressed="pinned"
      data-qa="pin button"
      :aria-label="$t('entity.actions.pin')"
      @click="pinAction"
    >
      <span class="icon-push-pin" />
      {{ pinButtonText }}
    </b-button>
    <b-modal
      v-if="entity"
      :id="pinnedLimitModalId"
      :title="$t('entity.notifications.pinLimit.title')"
      hide-footer
      hide-header-close
    >
      {{ $t('entity.notifications.pinLimit.body') }}
      <div class="modal-footer">
        <b-button
          variant="outline-primary"
          data-qa="cancel button"
          @click="$bvModal.hide(pinnedLimitModalId)"
        >
          {{ $t('actions.close') }}
        </b-button>
        <b-button
          variant="primary"
          @click="goToPins"
        >
          {{ $t('entity.actions.viewPinned') }}
        </b-button>
      </div>
    </b-modal>
    <ItemPinModal
      v-if="identifier && entities.length > 0"
      :identifier="identifier"
      :modal-id="pinModalId"
      :entities="entities"
      data-qa="pin item to entities modal"
    />
  </div>
</template>

<script>
  import makeToastMixin from '@/mixins/makeToast';

  export default {
    name: 'ItemPinButton',

    components: {
      ItemPinModal: () => import('./ItemPinModal')
    },

    mixins: [
      makeToastMixin
    ],

    props: {
      /**
       * Identifier of the item
       */
      identifier: {
        type: String,
        required: true
      },
      // Entities related to the item, used on item page.
      entities: {
        type: Array,
        default: () => []
      },
      /**
       * Button variant to use for styling the buttons
       */
      buttonVariant: {
        type: String,
        default: 'outline-light'
      },
      /**
       * If `true`, button text will be rendered
       */
      buttonText: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        pinModalId: `pin-modal-${this.identifier}`,
        pinnedLimitModalId: `pinned-limit-modal-${this.identifier}`
      };
    },

    computed: {
      pinned() {
        return this.$store.getters['entity/isPinned'](this.identifier);
      },
      pinButtonText() {
        if (this.buttonText) {
          return this.pinned ? this.$t('statuses.pinned') : this.$t('actions.pin');
        }
        return '';
      },
      entity() {
        return this.$store.getters['entity/id'];
      },
      featuredSet() {
        return this.$store.getters['entity/featuredSetId'];
      }
    },

    methods: {
      goToPins() {
        const path = this.$path(`/set/${this.featuredSet}`);
        this.$goto(path);
      },
      async pin() {
        if (this.featuredSet === null) {
          await this.$store.dispatch('entity/createFeaturedSet');
        }
        try {
          await this.$store.dispatch('entity/pin', this.identifier);
          this.makeToast(this.$t('entity.notifications.pinned', { entity: this.$store.getters['entity/englishPrefLabel'] }));
        } catch (e) {
          if (e.message === 'too many pins') {
            this.$bvModal.show(`pinned-limit-modal-${this.identifier}`);
          } else {
            throw e;
          }
        }
      },
      async unpin() {
        await this.$store.dispatch('entity/unpin', this.identifier);
        this.makeToast(this.$t('entity.notifications.unpinned'));
      },
      async pinAction() {
        if (this.entity || this.featuredSet) {
          await this.togglePin(); // On an entity/entity set page all info is in the store.
        } else {
          await this.$bvModal.show(this.pinModalId); // Open the modal to find which entity to pin to.
        }
      },
      async togglePin() {
        try {
          if (this.pinned) {
            await this.unpin();
          } else {
            await this.pin();
          }
        } catch (e) {
          this.$error(e, { scope: this.$errorCodes.APIS.SET });
        }
      }
    }
  };
</script>
