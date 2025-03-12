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
  </div>
</template>

<script>
  import hideTooltips from '@/mixins/hideTooltips';
  import logEventMixin from '@/mixins/logEvent';
  import useMakeToast from '@/composables/makeToast.js';
  import { ITEM_URL_PREFIX } from '@/plugins/europeana/data.js';

  export default {
    name: 'ItemLikeButton',

    mixins: [
      hideTooltips,
      logEventMixin
    ],

    inject: {
      likeHook: {
        default: () => {}
      },
      unlikeHook: {
        default: () => {}
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
      value: {
        type: Boolean,
        default: false
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
      const { makeToast } = useMakeToast();
      return { makeToast };
    },

    data() {
      return {
        liked: this.value
      };
    },

    computed: {
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

        await this.$apis.set.insertItems(this.likesId, this.identifier);
        this.liked = true;
        this.logEvent('like', `${ITEM_URL_PREFIX}${this.identifier}`);
        this.$matomo?.trackEvent('Item_like', 'Click like item button', this.identifier);
        this.makeToast(this.$t('set.notifications.itemLiked'));
        this.likeHook?.(this.identifier);
      },
      async unlike() {
        await this.$apis.set.deleteItems(this.likesId, this.identifier);
        this.liked = false;
        this.makeToast(this.$t('set.notifications.itemUnliked'));
        this.unlikeHook?.(this.identifier);
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
