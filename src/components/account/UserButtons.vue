<template>
  <div
    class="user-buttons"
    data-qa="user buttons"
  >
    <b-button
      v-show="showPins"
      :pressed="pinned"
      class="icon-push-pin"
      data-qa="pin button"
      :aria-label="$t('entity.actions.pin')"
      @click="togglePinned"
    />
    <b-button
      class="icon-ic-add"
      data-qa="add button"
      :aria-label="$t('set.actions.addTo')"
      @click="addToSet"
    />
    <b-button
      :pressed="liked"
      class="icon-heart"
      data-qa="like button"
      :aria-label="$t('actions.like')"
      size="sm"
      @click="toggleLiked"
    />
    <template
      v-if="$auth.loggedIn"
    >
      <AddItemToSetModal
        data-qa="add item to set modal"
        :modal-id="addItemToSetModalId"
        :item-id="value"
        :new-set-created="newSetCreated"
        @clickCreateSet="clickCreateSet"
        @hideModal="refreshSet"
      />
      <SetFormModal
        :modal-id="setFormModalId"
        :item-context="value"
        @response="setCreatedOrUpdated"
      />
      <PinToEntityModal
        :modal-id="pinModalId"
        :item-id="value"
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
      value: {
        type: String,
        required: true
      },
      showPins: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        addItemToSetModalId: `add-item-to-set-modal-${this.value}`,
        setFormModalId: `set-form-modal-${this.value}`,
        likeLimitModalId: `like-limit-modal-${this.value}`,
        pinModalId: `pin-modal-${this.value}`,
        pinnedLimitModalId: `pinned-limit-modal-${this.value}`,
        showFormModal: false,
        newSetCreated: false
      };
    },

    computed: {
      liked() {
        return this.$store.getters['set/isLiked'](this.value);
      },
      likesId() {
        return this.$store.state.set.likesId;
      },
      pinned() {
        return this.$store.getters['entity/isPinned'](this.value);
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
          await this.$store.dispatch('set/like', this.value);
          this.$emit('like', this.value);
          this.$matomo && this.$matomo.trackEvent('Item_like', 'Click like item button', this.value);
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
        await this.$store.dispatch('set/unlike', this.value);
        this.$emit('unlike', this.value);
      },
      addToSet() {
        if (this.$auth.loggedIn) {
          this.$bvModal.show(this.addItemToSetModalId);
          this.$emit('add', this.value);
          this.$matomo && this.$matomo.trackEvent('Item_add', 'Click add item button', this.value);
        } else {
          this.keycloakLogin();
        }
      }
    }
  };
</script>
