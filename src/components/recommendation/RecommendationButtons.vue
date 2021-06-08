<template>
  <div
    class="user-buttons"
    data-qa="recommendation buttons"
  >
    <client-only>
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
    </client-only>
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only';
  import keycloak from '../../mixins/keycloak';

  export default {
    name: 'RecommendationButtons',

    components: {
      ClientOnly
    },
    mixins: [
      keycloak
    ],

    props: {
      // Identifier of the item
      value: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        toastMsg: this.$t('set.notifications.updated')
      };
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
