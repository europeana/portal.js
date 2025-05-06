<template>
  <div :id="tooltipContainerId">
    <b-tooltip
      v-if="enabled"
      ref="newFeatureTooltip"
      :target="tooltipTargetId"
      :container="tooltipContainerId"
      :boundary-padding="15"
      placement="bottom"
      triggers=""
      :show="show"
      variant="primary"
      @hide="$emit('disabled')"
      @show="$emit('enabled')"
    >
      <span class="d-inline-flex align-items-start text-left">
        {{ $t(`newFeatureNotification.tooltip.${featureNotificationName}`) }}
        <b-button
          variant="dark-flat"
          class="pt-0 px-2 pb-2 text-white"
          :aria-label="$t('actions.close')"
          @click="$refs.newFeatureTooltip.$emit('close')"
        >
          <span class="icon-clear" />
        </b-button>
      </span>
    </b-tooltip>
  </div>
</template>

<script>
  import { activeFeatureNotification } from '@/features/notifications';

  export default {
    name: 'NewFeatureTooltip',

    props: {
      tooltipTargetId: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        featureNotificationName: activeFeatureNotification(this.$nuxt?.context)?.name,
        cookieName: 'new_feature_tooltip',
        matomoEvent: 'New_feature_tooltip',
        toastId: 'new-feature-toast',
        // custom tooltip container and show handling is needed to render tooltip at the right position
        tooltipContainerId: 'new-feature-tooltip-container',
        show: false
      };
    },

    computed: {
      enabled() {
        return this.featureNotificationName &&
          (this.$cookies.get(this.cookieName) !== this.featureNotificationName);
      }
    },

    async mounted() {
      if (!this.enabled) {
        return;
      }

      await this.$nextTick();
      this.show = true;

      this.trackEvent('show');

      this.$cookies.set(this.cookieName, this.featureNotificationName, {
        maxAge: 2678400
      });
    },

    methods: {
      trackEvent(msg) {
        if (this.$matomo) {
          this.$matomo.trackEvent(this.matomoEvent, msg, this.featureNotificationName);
        }
      }
    }
  };
</script>

<style lang="scss">
  #new-feature-tooltip-container .b-tooltip {
    z-index: 1029; // prevent tooltip overlapping the header on scroll (obvious on mobile)
  }
</style>
