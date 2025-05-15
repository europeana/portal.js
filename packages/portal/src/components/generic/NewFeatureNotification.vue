<template>
  <b-toast
    v-if="enabled"
    :id="toastId"
    :auto-hide-delay="60000"
    toast-class="brand-toast-white"
    :visible="true"
  >
    <p>{{ $t(`newFeatureNotification.text.${name}`) }}</p>
    <div class="d-flex justify-content-between align-items-start">
      <b-button
        class="mr-2"
        variant="outline-primary"
        data-qa="new feature dismiss"
        @click="handleClickDismiss"
      >
        {{ $t('newFeatureNotification.dismiss') }}
      </b-button>
      <b-button
        v-if="url"
        variant="primary"
        :href="url"
        target="blank"
        data-qa="new feature read more"
        @click="handleClickReadMore"
      >
        {{ $t('newFeatureNotification.readMore') }}
      </b-button>
    </div>
  </b-toast>
</template>

<script>
  export default {
    name: 'NewFeatureNotification',

    components: {
      'b-toast': () => import('@/components/bootstrap/b-toast')
    },

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

      this.$cookies.set(this.cookieName, this.name, {
        maxAge: 2678400
      });
    },

    methods: {
      handleClickDismiss() {
        this.hideToast();
        this.trackEvent('dismissed');
      },

      handleClickReadMore() {
        this.hideToast();
        this.trackEvent('click read more');
      },

      hideToast() {
        this.$bvToast.hide(this.toastId);
      },

      trackEvent(msg) {
        if (this.$matomo) {
          this.$matomo.trackEvent(this.matomoEvent, msg, this.name);
        }
      }
    }
  };
</script>
