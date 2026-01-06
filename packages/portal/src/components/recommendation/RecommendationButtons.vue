<template>
  <div
    class="user-buttons"
    data-qa="recommendation buttons"
  >
    <b-button
      v-if="enableAcceptButton"
      class="button-icon-only recommendation-button icon-accept"
      variant="outline-light"
      data-qa="accept button"
      :aria-label="$t('actions.accept')"
      @click="acceptRecommendation"
    />
    <b-button
      v-if="enableRejectButton"
      class="button-icon-only recommendation-button icon-reject"
      variant="outline-light"
      data-qa="reject button"
      :aria-label="$t('actions.reject')"
      @click="rejectRecommendation"
    />
  </div>
</template>

<script>
  import useMakeToast from '@/composables/makeToast.js';

  export default {
    name: 'RecommendationButtons',

    inject: ['fetchCurrentSet'],

    props: {
      // Identifier of the item
      identifier: {
        type: String,
        required: true
      },

      enableAcceptButton: {
        type: Boolean,
        default: true
      },

      enableRejectButton: {
        type: Boolean,
        default: true
      }
    },

    setup() {
      const { makeToast } = useMakeToast();
      return { makeToast };
    },

    data() {
      return {
        toastMsg: this.$t('set.notifications.updated')
      };
    },

    methods: {
      async acceptRecommendation() {
        if (this.$auth.loggedIn) {
          this.$store.dispatch('set/reviewRecommendation', { setId: `/${this.$route.params.pathMatch}`, itemIds: [this.identifier], action: 'accept' });
          await this.$apis.set.insertItems(`http://data.europeana.eu/set/${this.$route.params.pathMatch}`, this.identifier);
          this.fetchCurrentSet();
          this.makeToast(this.toastMsg);
        } else {
          this.$keycloak.login();
        }
      },
      rejectRecommendation() {
        if (this.$auth.loggedIn) {
          this.$store.dispatch('set/reviewRecommendation', { setId: `/${this.$route.params.pathMatch}`, itemIds: [this.identifier], action: 'reject' });
        } else {
          this.$keycloak.login();
        }
      }
    }
  };
</script>
