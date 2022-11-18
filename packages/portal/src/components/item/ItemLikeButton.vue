<template>
  <div>
    <b-button
      class="like-button text-uppercase d-inline-flex align-items-center"
      :class="{ 'button-icon-only': !buttonText }"
      :pressed="liked"
      :variant="buttonVariant"
      data-qa="like button"
      :aria-label="$t('actions.like')"
      @click="toggleLiked"
    >
      <span class="icon-heart" />
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
  import keycloak from '@/mixins/keycloak';

  export default {
    name: 'ItemLikeButton',

    mixins: [
      keycloak
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

    data() {
      return {
        likeLimitModalId: `like-limit-modal-${this.identifier}`
      };
    },

    computed: {
      liked() {
        return this.$store.getters['set/isLiked'](this.identifier);
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
      likedItems() {
        return this.$store.state.set.likedItems;
      }
    },

    methods: {
      async toggleLiked() {
        if (this.$auth.loggedIn) {
          await (this.liked ? this.unlike() : this.like());
        } else {
          this.keycloakLogin();
        }
      },
      async like() {
        if (this.likesId === null) {
          await this.$store.dispatch('set/createLikes');
        }

        try {
          // TODO: temporary prevention of addition of > 100 items; remove when no longer needed
          await this.$store.dispatch('set/fetchLikes');

          if (this.likedItems.length >= 100) {
            this.$bvModal.show(this.likeLimitModalId);
            return;
          }
          await this.$apis.set.modifyItems('add', this.$store.state.set.likesId, this.identifier);

          this.$matomo && this.$matomo.trackEvent('Item_like', 'Click like item button', this.identifier);
        } finally {
          await this.$store.dispatch('set/fetchLikes');
        }
      },
      async unlike() {
        try {
          await this.$apis.set.modifyItems('delete', this.$store.state.set.likesId, this.identifier);
        } finally {
          await this.$store.dispatch('set/fetchLikes');
        }
      }
    }
  };
</script>
