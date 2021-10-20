<template>
  <b-toast
    id="new-feature-toast"
    auto-hide-delay="60000"
    is-status
    no-close-button
    solid
    variant="brand-toast-white"
    visible
    append-toast
    toaster="b-toaster-bottom-left"
  >
    <p>{{ $t('newFeatureNotification.notification') }}</p>
    <div class="d-flex justify-content-between">
      <b-button
        variant="outline-primary"
        @click="hideToast"
      >
        {{ $t('newFeatureNotification.dismiss') }}
      </b-button>
      <b-button
        v-if="newFeatureUrl"
        variant="primary"
        :href="newFeatureUrl"
        target="blank"
        @click="trackEvent()"
      >
        {{ $t('newFeatureNotification.readMore') }}
      </b-button>
    </div>
  </b-toast>
</template>

<script>
  // TODO: add cookie
  export default {
    name: 'NewFeatureNotification',

    computed: {
      newFeatureUrl() {
        // TODO: keep this hard coded or move it elsewhere?
        return 'https://pro.europeana.eu/';
      }
    },

    created() {
      this.trackEvent('show');
      if (this.$cookies.get('new_feature_notification')) {
        this.$cookies.remove('new_feature_notification');
      }
      this.$cookies.set('new_feature_notification', 'organisations');
    },

    methods: {
      hideToast() {
        this.$bvToast.hide('new-feature-toast');
        this.trackEvent('dismissed');
      },

      trackEvent(msg) {
        if (this.$matomo) {
          this.$matomo.trackEvent('New_feature_notification', 'New feature notification', msg);
        }
      }
    }
  };
</script>
