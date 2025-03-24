<template>
  <b-tooltip
    v-if="enabled"
    :target="tooltipTargetId"
    placement="bottom"
    triggers=""
    show
    :custom-class="`new-feature-tooltip ${tooltipClass}`"
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
      },
      tooltipClass: {
        type: String,
        default: ''
      },
      setCookie: {
        type: Boolean,
        default: true
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

      if (this.setCookie) {
        this.$cookies.set(this.cookieName, this.name, {
          maxAge: 2678400
        });
      }
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

<style lang="scss">
  @import '@europeana/style/scss/variables';

  .new-feature-tooltip .tooltip-inner {
    background-image: linear-gradient(to right, $black 17%, $blue, $black 83%);
    background-size: 800% 100%;
    animation: slide 4000ms ease-in-out infinite;
  }

  .new-feature-tooltip.black .tooltip-inner {
    background-image: linear-gradient(to right, $blue 17%, $black, $blue 83%);
  }

  @keyframes slide {
    0% {
      background-position: left;
    }
    50% {
      background-position: right;
    }
    100% {
      background-position: right;
    }
  }
</style>

<docs lang="md">
  ```jsx
  <b-button id="blue-flash">blue flash</b-button>
  <NewFeatureTooltip
  tooltipTargetId="blue-flash"
  :set-cookie="false"
  />
  ```
  ```jsx
  <b-button id="black-flash">black flash</b-button>
  <NewFeatureTooltip
  tooltipTargetId="black-flash"
  tooltipClass="black"
  :set-cookie="false"
  />
  ```
</docs>
