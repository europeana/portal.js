<template>
  <div
    class="user-buttons"
    data-qa="user buttons"
  >
    <client-only>
      <template
        v-if="recommendedItem"
      >
        <b-button
          class="recommendation-buttons icon-accept"
          data-qa="accept button"
          :aria-label="$t('actions.accept')"
          @click="acceptRecommendation"
        />
        <b-button
          class="recommendation-buttons icon-reject"
          data-qa="reject button"
          :aria-label="$t('actions.reject')"
          @click="rejectRecommendation"
        />
      </template>
      <template
        v-else
      >
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
      </template>
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
        <!-- TODO: remove when 100-item like limit removed -->
        <b-modal
          :id="likeLimitModalId"
          :title="$t('set.notifications.likeLimit.title')"
          hide-footer
        >
          <p>{{ $t('set.notifications.likeLimit.body') }}</p>
        </b-modal>
      </template>
    </client-only>
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only';
  import keycloak from '../../mixins/keycloak';

  export default {
    name: 'UserButtons',

    components: {
      AddItemToSetModal: () => import('../set/AddItemToSetModal'),
      ClientOnly,
      SetFormModal: () => import('../set/SetFormModal')
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

      recommendedItem: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        addItemToSetModalId: `add-item-to-set-modal-${this.value}`,
        setFormModalId: `set-form-modal-${this.value}`,
        likeLimitModalId: `like-limit-modal-${this.value}`,
        toastMsg: this.$t('set.notifications.updated'),
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
      async like() {
        if (this.likesId === null) {
          await this.$store.dispatch('set/createLikes');
        }

        try {
          await this.$store.dispatch('set/like', this.value);
          this.$emit('like', this.value);
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
        } else {
          this.keycloakLogin();
        }
      },
      makeToast() {
        this.$root.$bvToast.toast(this.toastMsg, {
          toastClass: 'brand-toast',
          toaster: 'b-toaster-bottom-left',
          autoHideDelay: 5000,
          isStatus: true,
          noCloseButton: true,
          solid: true
        });
      },
      async acceptRecommendation() {
        if (this.$auth.loggedIn) {
          this.$store.dispatch('set/acceptRecommendation', { setId: `/${this.$route.params.pathMatch}`, itemIds: [this.value] });
          await this.$store.dispatch('set/addItem', { setId: `http://data.europeana.eu/set/${this.$route.params.pathMatch}`, itemId: this.value });
          this.$store.dispatch('set/refreshSet');
          this.makeToast();
        } else {
          this.$goto('/account/login');
        }
      },
      rejectRecommendation() {
        if (this.$auth.loggedIn) {
          this.$store.dispatch('set/rejectRecommendation', { setId: `/${this.$route.params.pathMatch}`, itemIds: [this.value] });
        } else {
          this.$goto('/account/login');
        }
      }
    }
  };
</script>
