<template>
  <div
    v-if="isPinnable && userMayPin"
    class="pin-button-wrapper"
  >
    <b-button
      class="pin-button text-uppercase"
      :class="{ 'button-icon-only': !buttonText }"
      :variant="buttonVariant"
      :pressed="pinned"
      data-qa="pin button"
      :aria-label="pinned ? $t('entity.actions.unpin') : $t('entity.actions.pin')"
      @click="pinAction"
    >
      <span :class="pinned ? 'icon-pin' : 'icon-pin-outlined'" />
      {{ pinButtonText }}
    </b-button>
    <b-modal
      v-if="entityId"
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
      :entity-uris="entityUris"
      data-qa="pin item to entities modal"
    />
  </div>
</template>

<script>
  import { usePinnedItems } from '@/composables/pinnedItems.js';

  export default {
    name: 'ItemPinButton',

    components: {
      ItemPinModal: () => import('./ItemPinModal')
    },

    inject: {
      currentEntity: {
        default: null
      },
      currentSet: {
        default: null
      },
      itemPinning: {
        default() {
          return {};
        }
      }
    },

    props: {
      /**
       * Identifier of the item
       */
      identifier: {
        type: String,
        required: true
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

    setup() {
      const { pin, unpin } = usePinnedItems();

      return { pin, unpin };
    },

    data() {
      return {
        pinned: false,
        pinModalId: `pin-modal-${this.identifier}`,
        pinnedLimitModalId: `pinned-limit-modal-${this.identifier}`
      };
    },

    computed: {
      entities() {
        return this.itemPinning.entities || [];
      },
      entityUris() {
        return this.entities.map((entity) => entity.about);
      },
      isPinnable() {
        return (this.entities.length > 0) || this.entityId || this.setId;
      },
      userMayPin() {
        return this.userIsEntitiesEditor && this.userIsSetsEditor;
      },
      userIsEntitiesEditor() {
        return this.$auth.userHasClientRole('entities', 'editor');
      },
      userIsSetsEditor() {
        return this.$auth.userHasClientRole('usersets', 'editor');
      },
      pinButtonText() {
        if (this.buttonText) {
          return this.pinned ? this.$t('statuses.pinned') : this.$t('actions.pin');
        }
        return '';
      },
      entityId() {
        return this.currentEntity?.id;
      },
      setId() {
        return (this.currentSet?.type === 'EntityBestItemsSet' && this.currentSet?.id?.split('/')?.pop())
          || null;
      }
    },

    created() {
      let pinnedItemIds = [];

      if ((this.currentSet?.pinned > 0) && this.currentSet?.items) {
        pinnedItemIds = this.currentSet.items
          .slice(0, this.currentSet.pinned)
          .map((item) => typeof item === 'object' ? item.id : item);
      }

      this.pinned = pinnedItemIds.some((pin) => pin.endsWith(this.identifier));
    },

    methods: {
      goToPins() {
        const path = this.localePath(`/set/${this.setId}`);
        this.$router.push(path);
      },
      async pinAction() {
        if (this.setId || this.entityId) {
          await this.togglePin(); // On an entity/entity set page all info is injected.
        } else {
          await this.$bvModal.show(this.pinModalId); // Open the modal to find which entity to pin to.
        }
      },
      async togglePin() {
        try {
          if (this.pinned) {
            await this.unpin(this.identifier, this.entityId);
            this.pinned = false;
          } else {
            await this.pin(this.identifier, this.entityId);
            this.pinned = true;
          }
        } catch (error) {
          this.$error(error, { scope: error.statusCode === 404 ? 'pinning' : 'gallery' });
        } finally {
          // FIXME
          // this.fetchEntityBestItemsSetPinnedItems(this.setId);
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .pin-button:hover {
    .icon-pin-outlined::before {
      content: '\e91e';
    }
    .icon-pin::before {
      content: '\e936';
    }
  }
</style>
