<template>
  <div
    class="user-buttons"
    data-qa="user buttons"
  >
    <b-button
      v-show="showPins"
      class="pin-button text-uppercase align-items-center"
      :variant="buttonVariant"
      :pressed="pinned"
      data-qa="pin button"
      :aria-label="$t('entity.actions.pin')"
      @click="togglePinned"
    >
      <span class="icon-push-pin" />
      {{ pinButtonText }}
    </b-button>
    <b-button
      data-qa="add button"
      class="add-button text-uppercase d-inline-flex align-items-center"
      :variant="buttonVariant"
      :aria-label="$t('set.actions.addTo')"
      @click="addToSet"
    >
      <span class="icon-ic-add" />
      {{ buttonText ? $t('set.actions.save') : '' }}
    </b-button>
    <b-button
      class="like-button text-uppercase d-inline-flex align-items-center"
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
      <PinToEntityModal
        :modal-id="pinModalId"
        :item-id="identifier"
        :pinned="pinned"
        data-qa="pin item to entity modal"
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

  export default {
    name: 'UserButtons',

    components: {
      AddItemToSetModal: () => import('../set/AddItemToSetModal'),
      SetFormModal: () => import('../set/SetFormModal'),
      PinToEntityModal: () => import('../entity/PinModal')
    },
    mixins: [
      keycloak
    ],

    props: {
      // Identifier of the item
      identifier: {
        type: String,
        required: true
      },
      showPins: {
        type: Boolean,
        default: false
      },
      buttonVariant: {
        type: String,
        default: null
      },
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
        pinModalId: `pin-modal-${this.identifier}`,
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
          return this.pinned ? this.$t('actions.pinned') : this.$t('actions.pin');
        }
        return '';
      },
      likeButtonText() {
        if (this.buttonText) {
          return this.liked ? this.$t('actions.liked') : this.$t('actions.like');
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
      togglePinned() {
        this.$bvModal.show(this.pinModalId);
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
        this.$emit('unlike', this.identifier);
      },
      addToSet() {
        if (this.$auth.loggedIn) {
          this.$bvModal.show(this.addItemToSetModalId);
          this.$emit('add', this.identifier);
          this.$matomo && this.$matomo.trackEvent('Item_add', 'Click add item button', this.identifier);
        } else {
          this.keycloakLogin();
        }
      }
    }
  };
</script>
