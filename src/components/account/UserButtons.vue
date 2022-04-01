<template>
  <div
    class="user-buttons"
    data-qa="user buttons"
  >
    <b-button
      v-show="showPins"
      class="pin-button text-uppercase"
      :class="{ 'button-icon-only': !buttonText }"
      :variant="buttonVariant"
      :pressed="pinned"
      data-qa="pin button"
      :aria-label="$t('entity.actions.pin')"
      @click="togglePin"
    >
      <span class="icon-push-pin" />
      {{ pinButtonText }}
    </b-button>
    <b-button
      class="add-button text-uppercase d-inline-flex align-items-center"
      :class="{ 'button-icon-only': !buttonText }"
      data-qa="add button"
      :variant="buttonVariant"
      :aria-label="$t('set.actions.addTo')"
      @click="addToSet"
    >
      <span class="icon-ic-add" />
      {{ buttonText ? $t('set.actions.save') : '' }}
    </b-button>
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
    <template
      v-if="$auth.loggedIn"
    >
      <AddItemToSetModal
        data-qa="add item to set modal"
        :modal-id="addItemToSetModalId"
        :item-id="identifier"
        :new-set-created="newSetCreated"
        @clickCreateSet="clickCreateSet"
        @hideModal="refreshSet"
      />
      <SetFormModal
        :modal-id="setFormModalId"
        :item-context="identifier"
        @response="setCreatedOrUpdated"
      />
      <!-- TODO: remove when 100-item like limit removed -->
      <b-modal
        :id="likeLimitModalId"
        :title="$t('set.notifications.likeLimit.title')"
        hide-footer
      >
        <p>{{ $t('set.notifications.likeLimit.body') }}</p>
      </b-modal>
      <b-modal
        v-if="showPins"
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
    </template>
  </div>
</template>

<script>
  import keycloak from '@/mixins/keycloak';
  import makeToastMixin from '@/mixins/makeToast';

  /**
   * User buttons for user interaction with items
   */
  export default {
    name: 'UserButtons',

    components: {
      AddItemToSetModal: () => import('../set/AddItemToSetModal'),
      SetFormModal: () => import('../set/SetFormModal')
    },
    mixins: [
      keycloak,
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
      /**
       * If `true`, pin button will be rendered
       */
      showPins: {
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

    data() {
      return {
        addItemToSetModalId: `add-item-to-set-modal-${this.identifier}`,
        setFormModalId: `set-form-modal-${this.identifier}`,
        likeLimitModalId: `like-limit-modal-${this.identifier}`,
        pinnedLimitModalId: `pinned-limit-modal-${this.identifier}`,
        showFormModal: false,
        newSetCreated: false
      };
    },

    computed: {
      liked() {
        return this.$store.getters['set/isLiked'](this.identifier);
      },
      likesId() {
        return this.$store.state.set.likesId;
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
      likeButtonText() {
        if (this.buttonText) {
          return this.liked ? this.$t('statuses.liked') : this.$t('actions.like');
        }
        return '';
      }
    },
    created() {
      this.$root.$on('clickCreateSet', () => {
        this.clickCreateSet();
      });
    },
    methods: {
      clickCreateSet() {
        if (this.showFormModal === false) {
          this.showFormModal = true;
          this.newSetCreated = false;
          this.$bvModal.hide(this.addItemToSetModalId);
          this.$bvModal.show(this.setFormModalId);
        }
      },
      setCreatedOrUpdated() {
        this.showFormModal = false;
        this.newSetCreated = true;
        this.$bvModal.show(this.addItemToSetModalId);
      },
      refreshSet() {
        if (!this.showFormModal) {
          this.$store.dispatch('set/refreshSet');
        }
      },
      async toggleLiked() {
        if (this.$auth.loggedIn) {
          await (this.liked ? this.unlike() : this.like());
        } else {
          this.keycloakLogin();
        }
      },
      goToPins() {
        const path = this.$path(`/set/${this.$store.state.entity.featuredSetId}`);
        this.$goto(path);
      },
      async like() {
        if (this.likesId === null) {
          await this.$store.dispatch('set/createLikes');
        }

        try {
          await this.$store.dispatch('set/like', this.identifier);
          /**
           * triggers on like button click when not yet liked
           * @event like
           * @property {string} identifier - identifier of the item to be liked
           */
          this.$emit('like', this.identifier);
          this.$matomo && this.$matomo.trackEvent('Item_like', 'Click like item button', this.identifier);
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
        /**
         * triggers on like button click when already liked
         * @event unlike
         * @property {string} identifier - identifier of the item to be unliked
         */
        this.$emit('unlike', this.identifier);
      },
      addToSet() {
        if (this.$auth.loggedIn) {
          this.$bvModal.show(this.addItemToSetModalId);
          /**
           * triggers on add to set button click
           * @event add
           * @property {string} identifier - identifier of the item to be added to the set
           */
          this.$emit('add', this.identifier);
          this.$matomo && this.$matomo.trackEvent('Item_add', 'Click add item button', this.identifier);
        } else {
          this.keycloakLogin();
        }
      },
      async pin() {
        if (this.$store.state.entity.featuredSetId === null) {
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
      async togglePin() {
        if (this.pinned) {
          await this.unpin();
        } else {
          await this.pin();
        }
      }
    }
  };
</script>

<docs lang="md">
  Default format:
  ```jsx
  <UserButtons
      identifier="123"
      :showPins="true"
  />
  ```

  With buttonVariant set to "secondary":
  ```jsx
  <UserButtons
    identifier="123"
    :showPins="true"
    buttonVariant="secondary"
  />
  ```

  With buttonVariant set to "light-flat" and buttonText to true:
  ```jsx
  <UserButtons
    identifier="123"
    :showPins="true"
    buttonVariant="light-flat"
    :buttonText="true"
  />
  ```
</docs>
