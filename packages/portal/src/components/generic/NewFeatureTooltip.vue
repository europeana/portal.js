<template>
  <b-tooltip
    v-if="enabled"
    :target="tooltipTargetId"
    placement="bottom"
    triggers=""
    show
    variant="primary"
    @hide="$emit('disabled')"
    @show="$emit('enabled')"
  >
    {{ $t('newFeatureNotification.tooltip') }}
  </b-tooltip>
</template>

<script>
  import { activeFeatureNotification } from '@/features/notifications';

  export default {
    name: 'NewFeatureTooltip',

    props: {
      tooltipTargetId: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        featureNotification: activeFeatureNotification(this.$nuxt?.context),
        cookieName: 'new_feature_tooltip',
        matomoEvent: 'New_feature_tooltip',
        toastId: 'new-feature-toast'
      };
    },

    computed: {
      enabled() {
        return this.$cookies.get(this.cookieName) !== this.featureNotification.name;
      }
    },

    mounted() {
      if (!this.enabled) {
        return;
      }

      this.trackEvent('show');

      this.$cookies.set(this.cookieName, this.featureNotification.name, {
        maxAge: 2678400
      });
    },

    methods: {
      trackEvent(msg) {
        if (this.$matomo) {
          this.$matomo.trackEvent(this.matomoEvent, msg, this.featureNotification.name);
        }
      }
    }
  };
</script>
