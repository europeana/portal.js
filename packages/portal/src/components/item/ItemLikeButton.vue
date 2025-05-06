<template>
  <div>
    <b-button
      :id="buttonId"
      v-b-tooltip.bottom
      class="like-button text-uppercase d-inline-flex align-items-center"
      :class="{ 'button-icon-only': !buttonText }"
      :pressed="liked"
      :disabled="disabled"
      :variant="buttonVariant"
      data-qa="like button"
      :aria-label="liked ? $t('actions.unlike') : $t('actions.like')"
      :title="tooltipTitle"
      @click="toggleLiked"
    >
      <span :class="liked ? 'icon-heart' : 'icon-heart-outlined'" />
      {{ likeButtonText }}
    </b-button>
  </div>
</template>

<script>
  import { useCardinality } from '@/composables/cardinality.js';
  import { useEventBus } from '@vueuse/core';
  import useHideTooltips from '@/composables/hideTooltips.js';
  import { useLogEvent } from '@/composables/logEvent.js';
  import useMakeToast from '@/composables/makeToast.js';
  import { ITEM_URL_PREFIX } from '@/plugins/europeana/data.js';

  export default {
    name: 'ItemLikeButton',

    props: {
      /**
       * Identifier(s) of the item
       */
      identifiers: {
        type: [String, Array],
        required: true
      },
      value: {
        type: Boolean,
        default: null
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

    setup(props) {
      const idSuffix = Array.isArray(props.identifiers) ? 'multi-select' : props.identifiers;
      const buttonId = `item-like-button-${idSuffix}`;
      const likeLimitModalId = `like-limit-modal-${idSuffix}`;

      const { cardinality } = useCardinality(props.identifiers);
      const eventBus = useEventBus('likedItems');
      const { hideTooltips } = useHideTooltips();
      const { logEvent } = useLogEvent();
      const { makeToast } = useMakeToast();

      return { buttonId, cardinality, eventBus, hideTooltips, likeLimitModalId, logEvent, makeToast };
    },

    data() {
      return {
        liked: this.value
      };
    },

    computed: {
      disabled() {
        return this.selectionCount === 0;
      },
      likesId() {
        return this.$store.state.set.likesId;
      },
      likeButtonText() {
        if (this.buttonText) {
          return this.liked ? this.$t('statuses.liked') : this.$t('actions.like');
        }
        return '';
      },
      likeToastMessage() {
        return this.$tc(`set.notifications.itemsLiked.${this.cardinality}`, this.selectionCount, { count: this.selectionCount });
      },
      selectionCount() {
        return Array.isArray(this.identifiers) ? this.identifiers.length : 1;
      },
      tooltipTitle() {
        if (this.liked) {
          return this.$tc(`set.actions.unlikeItems.${this.cardinality}`, this.selectionCount, { count: this.selectionCount });
        } else {
          return this.$tc(`set.actions.likeItems.${this.cardinality}`, this.selectionCount, { count: this.selectionCount });
        }
      },
      unlikeToastMessage() {
        return this.$tc(`set.notifications.itemsUnliked.${this.cardinality}`, this.selectionCount, { count: this.selectionCount });
      }
    },

    watch: {
      value() {
        this.liked = this.value;
      }
    },

    methods: {
      async toggleLiked() {
        if (this.$auth.loggedIn) {
          try {
            await (this.liked ? this.unlike() : this.like());
          } catch (e) {
            // TODO: handle 404 which may indicate likes set has been deleted;
            //       create a new one and retry
            this.$error(e, { scope: 'gallery' });
          }
        } else {
          this.$keycloak.login();
        }
        this.hideTooltips();
      },

      async like() {
        if (this.likesId === null) {
          const response = await this.$apis.set.createLikes();
          this.$store.commit('set/setLikesId', response.id);
        }

        await this.$apis.set.insertItems(this.likesId, this.identifiers);
        this.eventBus.emit('like', this.identifiers);
        this.liked = true;
        this.logEvent('like', [].concat(this.identifiers).map((id) => `${ITEM_URL_PREFIX}${id}`), this.$session);

        for (const id of [].concat(this.identifiers)) {
          this.$matomo?.trackEvent('Item_like', 'Click like item button', id);
        }
        this.makeToast(this.likeToastMessage);
      },
      async unlike() {
        await this.$apis.set.deleteItems(this.likesId, this.identifiers);
        this.eventBus.emit('unlike', this.identifiers);
        this.liked = false;
        this.makeToast(this.unlikeToastMessage);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .like-button:hover {
    .icon-heart-outlined::before {
      content: '\e918';
    }
    .icon-heart::before {
      content: '\e9da';
    }
  }
</style>
