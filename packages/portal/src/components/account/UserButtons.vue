<template>
  <div
    class="user-buttons"
    data-qa="user buttons"
  >
    <ItemPinButton
      v-show="showPins"
      :identifier="identifier"
      :entities="entities"
      :button-variant="buttonVariant"
      :button-text="buttonText"
    />
    <b-button
      v-if="showMove"
      class="move-button text-uppercase d-inline-flex align-items-center"
      :class="{ 'button-icon-only': !buttonText }"
      data-qa="add button"
      :variant="buttonVariant"
      :aria-label="$t('actions.move')"
    >
      <span class="icon-ic-move-xy" />
      {{ buttonText ? $t('actions.move') : '' }}
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
      {{ buttonText ? $t('actions.save') : '' }}
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
    </template>
  </div>
</template>

<script>
  import keycloak from '@/mixins/keycloak';
  import makeToastMixin from '@/mixins/makeToast';

  export default {
    name: 'UserButtons',

    components: {
      AddItemToSetModal: () => import('../set/AddItemToSetModal'),
      SetFormModal: () => import('../set/SetFormModal'),
      ItemPinButton: () => import('../item/ItemPinButton')
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
      // Entities related to the item, used on item page.
      entities: {
        type: Array,
        default: () => []
      },
      /**
       * If `true`, pin button will be rendered
       */
      showPins: {
        type: Boolean,
        default: false
      },
      /**
       * If `true`, move button will be rendered
       */
      showMove: {
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
      likeButtonText() {
        if (this.buttonText) {
          return this.liked ? this.$t('statuses.liked') : this.$t('actions.like');
        }
        return '';
      }
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
      }
    }
  };
</script>
