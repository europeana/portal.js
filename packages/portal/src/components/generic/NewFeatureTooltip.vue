<template>
  <b-tooltip
    v-if="enabled"
    :target="tooltipTargetId"
    placement="bottom"
    triggers=""
    show
    variant="primary"
  >
    {{ $t('newFeatureNotification.tooltip') }}
  </b-tooltip>
</template>

<script>
  export default {
    name: 'NewFeatureTooltip',

    props: {
      name: {
        type: String,
        default: null
      },
      tooltipTargetId: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        cookieName: 'new_feature_tooltip',
        matomoEvent: 'New_feature_tooltip',
        newFeaturTooltipTargetIsRendered: false,
        toastId: 'new-feature-toast'
      };
    },

    computed: {
      enabled() {
        return this.newFeaturTooltipTargetIsRendered && this.$cookies.get(this.cookieName) !== this.name;
      }
    },

    mounted() {
      this.newFeaturTooltipTargetIsRendered = document.getElementById(this.tooltipTargetId);

      if (!this.enabled) {
        return;
      }

      this.trackEvent('show');

      this.$cookies.set(this.cookieName, this.name, {
        maxAge: 2678400
      });
    },

    methods: {
      trackEvent(msg) {
        if (this.$matomo) {
          this.$matomo.trackEvent(this.matomoEvent, msg, this.name);
        }
      }
    }
  };
</script>
