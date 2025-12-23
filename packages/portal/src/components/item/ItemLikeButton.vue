<template>
  <div>
    <b-button
      :id="buttonId"
      v-b-tooltip.bottom
      class="like-button text-uppercase d-inline-flex align-items-center"
      :class="{ 'button-icon-only': !buttonText }"
      :pressed="pressed"
      :disabled="disabled"
      :variant="buttonVariant"
      data-qa="like button"
      :aria-label="pressed ? $t('actions.unlike') : $t('actions.like')"
      :title="tooltipTitle"
      @click="toggleLiked"
    >
      <span :class="pressed ? 'icon-heart' : 'icon-heart-outlined'" />
      {{ likeButtonText }}
    </b-button>
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

    inject: ['like', 'likedItems', 'unlike'],

    props: {
      /**
       * Identifier(s) of the item(s)
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

      const { cardinality } = useCardinality(props.identifiers);
      const { hideTooltips } = useHideTooltips();
      const { logEvent } = useLogEvent();
      const { makeToast } = useMakeToast();

      return { buttonId, cardinality, hideTooltips, logEvent, makeToast };
    },

    data() {
      return {
        pressed: false
      };
    },

    computed: {
      disabled() {
        return this.selectionCount === 0;
      },
      everyItemLiked() {
        // console.log('everyItemLiked', this.likedItems);
        return [].concat(this.identifiers).every((id) => this.likedItems[id]);
      },
      likeButtonText() {
        if (this.buttonText) {
          return this.everyItemLiked ? this.$t('statuses.liked') : this.$t('actions.like');
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
        if (this.everyItemLiked) {
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
      everyItemLiked: {
        deep: true,
        handler() {
          console.log('watch everyItemLiked', this.everyItemLiked);
          this.pressed = this.everyItemLiked;
        }
      }
    },

    created() {
      this.pressed = this.everyItemLiked;
    },

    methods: {
      async toggleLiked() {
        if (this.$auth.loggedIn) {
          try {
            await (this.pressed ? this.handleUnlike() : this.handleLike());
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

      async handleLike() {
        console.log('handleLike');
        await this.like();
        this.logEvent('like', [].concat(this.identifiers).map((id) => `${ITEM_URL_PREFIX}${id}`), this.$session);

        for (const id of [].concat(this.identifiers)) {
          this.$matomo?.trackEvent('Item_like', 'Click like item button', id);
        }
        this.makeToast(this.likeToastMessage);
      },
      async handleUnlike() {
        await this.unlike();

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
