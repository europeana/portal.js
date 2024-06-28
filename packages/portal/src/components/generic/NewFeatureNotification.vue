<template>
  <b-toast
    v-if="enabled"
    :id="toastId"
    auto-hide-delay="60000"
    is-status
    no-close-button
    solid
    toast-class="brand-toast-white"
    visible
    append-toast
    toaster="b-toaster-bottom-left-dynamic"
  >
    <p>{{ $t(`newFeatureNotification.text.${name}`) }}</p>
    <div class="d-flex justify-content-between align-items-start">
      <b-button
        class="mr-2"
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
        data-qa="new feature read more"
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
      name: {
        type: String,
        required: true
      },

      url: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        cookieName: 'new_feature_notification',
        matomoEvent: 'New_feature_notification',
        toastId: 'new-feature-toast'
      };
    },

    computed: {
      enabled() {
        return this.$cookies.get(this.cookieName) !== this.name;
      }
    },

    created() {
      if (!this.enabled) {
        return;
      }

      this.trackEvent('show');

      // TODO: why do we set this immediately and not after interaction?
      this.$cookies.set(this.cookieName, this.name, {
        maxAge: 2678400
      });
    },

    methods: {
      hideToast() {
        this.$bvToast.hide(this.toastId);
        this.trackEvent('dismissed');
      },

      trackEvent(msg) {
        if (this.$matomo) {
          this.$matomo.trackEvent(this.matomoEvent, msg, this.name);
        }
      }
    }
  };
</script>
