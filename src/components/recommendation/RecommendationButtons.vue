<template>
  <div
    class="user-buttons"
    data-qa="recommendation buttons"
  >
    <b-button
      v-if="enableAcceptRecommendations"
      class="recommendation-button icon-accept"
      data-qa="accept button"
      :aria-label="$t('actions.accept')"
      @click="acceptRecommendation"
    />
    <b-button
      v-if="enableRejectRecommendations"
      class="recommendation-button icon-reject"
      data-qa="reject button"
      :aria-label="$t('actions.reject')"
      @click="rejectRecommendation"
    />
  </div>
</template>

<script>
  import keycloak from '@/mixins/keycloak';

  export default {
    name: 'RecommendationButtons',

    mixins: [
      keycloak
    ],

    props: {
      // Identifier of the item
      identifier: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        toastMsg: this.$t('set.notifications.updated')
      };
    },

    computed: {
      enableAcceptRecommendations() {
        if (this.setIsEntityBestItems) {
          return this.$config.app.features.acceptEntityRecommendations;
        }
        return this.$config.app.features.acceptSetRecommendations;
      },
      enableRejectRecommendations() {
        if (this.setIsEntityBestItems) {
          return this.$config.app.features.rejectEntityRecommendations;
        }
        return this.$config.app.features.acceptSetRecommendations;
      },
      set() {
        return this.$store.state.set?.active || {};
      },
      setIsEntityBestItems() {
        return this.set.type === 'EntityBestItemsSet';
      }
    },

    methods: {
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
          this.$store.dispatch('set/reviewRecommendation', { setId: `/${this.$route.params.pathMatch}`, itemIds: [this.identifier], action: 'accept' });
          await this.$store.dispatch('set/addItem', { setId: `http://data.europeana.eu/set/${this.$route.params.pathMatch}`, itemId: this.identifier });
          this.$store.dispatch('set/refreshSet');
          this.makeToast();
        } else {
          this.keycloakLogin();
        }
      },
      rejectRecommendation() {
        if (this.$auth.loggedIn) {
          this.$store.dispatch('set/reviewRecommendation', { setId: `/${this.$route.params.pathMatch}`, itemIds: [this.identifier], action: 'reject' });
        } else {
          this.keycloakLogin();
        }
      }
    }
  };
</script>
