<template>
  <div>
    <b-button
      v-b-tooltip.bottom
      :id="buttonId"
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
    <!-- TODO: remove when 100-item like limit removed -->
    <b-modal
      :id="likeLimitModalId"
      :title="$t('set.notifications.likeLimit.title')"
      hide-footer
    >
      <p>{{ $t('set.notifications.likeLimit.body') }}</p>
    </b-modal>
  </div>
</template>

<script>
  import { useCardinality } from '@/composables/cardinality.js';
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
      const { hideTooltips } = useHideTooltips(buttonId);
      const { logEvent } = useLogEvent();
      const { makeToast } = useMakeToast();

      return { buttonId, cardinality, hideTooltips, likeLimitModalId, logEvent, makeToast };
    },

    computed: {
      disabled() {
        return this.selectionCount === 0;
      },
      liked() {
        if (Array.isArray(this.identifiers)) {
          return this.identifiers.every((id) => this.$store.state.set.likedItemIds.includes(id));
        } else {
          return this.$store.state.set.likedItemIds.includes(this.identifiers);
        }
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

        try {
          await this.$store.dispatch('set/like', this.identifiers);

          this.logEvent('like', [].concat(this.identifiers).map((id) => `${ITEM_URL_PREFIX}${id}`), this.$session);

          for (const id of [].concat(this.identifiers)) {
            this.$matomo?.trackEvent('Item_like', 'Click like item button', id);
          }

          this.makeToast(this.likeToastMessage);
        } catch (e) {
          // TODO: remove when 100 item like limit is removed
          if (e.message === '100 likes') {
            this.$bvModal.show(this.likeLimitModalId);
          } else {
            throw e;
          }
        }
      },
      async unlike() {
        await this.$store.dispatch('set/unlike', this.identifiers);
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
