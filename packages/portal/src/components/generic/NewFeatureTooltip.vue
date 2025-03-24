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

  .new-feature-tooltip {
    z-index: 1071; // overlap the target's original tooltip

    .tooltip-inner {
      border-radius: 0.25rem;
      padding: 0;
      background-image: linear-gradient(to right, $blue 17%, $black, $blue 83%);
      background-size: 800% 100%;
      animation: slide 3000ms ease-in-out infinite;
    }

    &.tooltip.b-tooltip .arrow {
      display: block;

      &::before {
        z-index: 1;
        border-bottom-color: $blue;
      }

      &:after { // mimics a border around the arrow
        content: "";
        bottom: 0;
        border-width: 0 8px 8px;
        position: absolute;
        border-color: transparent;
        border-bottom-color: $lightgrey;
        border-style: solid;
        left: -2px;
      }
    }
  }

  @keyframes slide {
    0% {
      background-position: left;
    }
    75% {
      background-position: right;
    }
    100% {
      background-position: right;
    }
  }
</style>

<docs lang="md">
  ```jsx
  <b-button id="new-feat-tooltip">target</b-button>
  <NewFeatureTooltip
  tooltipTargetId="new-feat-tooltip"
  :set-cookie="false"
  />
  ```
</docs>
