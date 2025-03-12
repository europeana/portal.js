<template>
  <div>
    <b-button
      v-b-tooltip.bottom
      class="like-button text-uppercase d-inline-flex align-items-center"
      :class="{ 'button-icon-only': !buttonText }"
      :pressed="liked"
      :variant="buttonVariant"
      data-qa="like button"
      :aria-label="liked ? $t('actions.unlike') : $t('actions.like')"
      :title="liked ? $t('set.actions.removeItemFromLikes') : $t('set.actions.saveItemToLikes')"
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
  import useHideTooltips from '@/composables/hideTooltips.js';
  import logEventMixin from '@/mixins/logEvent';
  import useMakeToast from '@/composables/makeToast.js';
  import { ITEM_URL_PREFIX } from '@/plugins/europeana/data.js';

  export default {
    name: 'ItemLikeButton',

    mixins: [
      logEventMixin
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
      const { hideTooltips } = useHideTooltips();
      const { makeToast } = useMakeToast();
      return { hideTooltips, makeToast };
    },

    data() {
      return {
        likeLimitModalId: `like-limit-modal-${this.identifier}`
      };
    },

    computed: {
      liked() {
        return this.$store.state.set.likedItemIds.includes(this.identifier);
      },
      likesId() {
        return this.$store.state.set.likesId;
      },
      likeButtonText() {
        if (this.buttonText) {
          return this.liked ? this.$t('statuses.liked') : this.$t('actions.like');
        }
        return '';
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
          await this.$store.dispatch('set/like', this.identifier);
          this.logEvent('like', `${ITEM_URL_PREFIX}${this.identifier}`);
          this.$matomo?.trackEvent('Item_like', 'Click like item button', this.identifier);
          this.makeToast(this.$t('set.notifications.itemLiked'));
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
        await this.$store.dispatch('set/unlike', this.identifier);
        this.makeToast(this.$t('set.notifications.itemUnliked'));
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
