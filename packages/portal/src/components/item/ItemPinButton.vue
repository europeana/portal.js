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
  import makeToastMixin from '@/mixins/makeToast';
  import entityBestItemsSetMixin from '@/mixins/europeana/entities/entityBestItemsSet';
  import { langMapValueForLocale } from '@europeana/i18n';

  export default {
    name: 'ItemPinButton',

    components: {
      ItemPinModal: () => import('./ItemPinModal')
    },

    mixins: [
      makeToastMixin,
      entityBestItemsSetMixin
    ],

    props: {
      /**
       * Identifier of the item
       */
      identifier: {
        type: String,
        required: true
      },
      /**
       * Entities related to the item, used on item page.
       */
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
      entityUris() {
        return this.entities.map((entity) => entity.about);
      },
      pinned() {
        return this.$store.getters['entity/isPinned'](this.identifier);
      },
      pinButtonText() {
        if (this.buttonText) {
          return this.pinned ? this.$t('statuses.pinned') : this.$t('actions.pin');
        }
        return '';
      },
      entityId() {
        return this.$store.state.entity.id;
      },
      setId() {
        return this.$store.state.entity.bestItemsSetId;
      }
    },

    methods: {
      goToPins() {
        const path = this.localePath(`/set/${this.setId}`);
        this.$router.push(path);
      },
      async pin() {
        const setId = await this.ensureEntityBestItemsSetExists(this.setId, this.$store.state.entity.entity);
        this.$store.commit('entity/setBestItemsSetId', setId);
        await this.pinItemToEntityBestItemsSet(this.identifier, this.setId, langMapValueForLocale(this.$store.state.entity.entity?.prefLabel, this.$i18n.locale).values[0]);
      },
      async unpin() {
        await this.unpinItemFromEntityBestItemsSet(this.identifier, this.setId);
      },
      async pinAction() {
        if (this.setId || this.entityId) {
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
        } catch (error) {
          this.$error(error, { scope: error.statusCode === 404 ? 'pinning' : 'gallery' });
        } finally {
          this.fetchEntityBestItemsSetPinnedItems(this.setId);
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .pin-button:hover {
    .icon-pin-outlined::before {
      content: '\e91e';
    }
    .icon-pin::before {
      content: '\e936';
    }
  }
</style>
