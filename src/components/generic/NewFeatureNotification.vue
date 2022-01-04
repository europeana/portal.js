<template>
  <b-toast
    id="new-feature-toast"
    auto-hide-delay="60000"
    is-status
    no-close-button
    solid
    toast-class="brand-toast-white"
    visible
    append-toast
    toaster="b-toaster-bottom-left-dynamic"
  >
    <p>{{ text }}</p>
    <div class="d-flex justify-content-between">
      <b-button
        variant="outline-primary"
        @click="hideToast"
      >
        {{ $t('newFeatureNotification.dismiss') }}
      </b-button>
      <b-button
        v-if="url"
        variant="primary"
        :href="url"
        target="blank"
        @click="trackEvent('click read more')"
      >
        {{ $t('newFeatureNotification.readMore') }}
      </b-button>
    </div>
  </b-toast>
</template>

<script>
  export default {
    name: 'NewFeatureNotification',

    props: {
      text: {
        type: String,
        required: true
      },
      url: {
        type: String,
        default: null
      },
      feature: {
        type: String,
        default: null
      }
    },

    created() {
      this.trackEvent('show');
      this.$cookies.set('new_feature_notification', this.feature);
    },

    methods: {
      hideToast() {
        this.$bvToast.hide('new-feature-toast');
        this.trackEvent('dismissed');
      },

      trackEvent(msg) {
        if (this.$matomo) {
          this.$matomo.trackEvent('New_feature_notification', msg, this.feature);
        }
      }
    }
  };
</script>
