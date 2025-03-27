<template>
  <b-tooltip
    v-if="enabled"
    ref="newFeatureTooltip"
    :target="tooltipTargetId"
    placement="bottom"
    triggers=""
    show
    variant="primary"
    @hide="$emit('disabled')"
    @show="$emit('enabled')"
  >
    <span class="d-inline-flex align-items-start text-left">
      {{ $t('newFeatureNotification.tooltip') }}
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
        featureNotificationName: activeFeatureNotification(this.$nuxt?.context)?.name,
        cookieName: 'new_feature_tooltip',
        matomoEvent: 'New_feature_tooltip',
        toastId: 'new-feature-toast'
      };
    },

    computed: {
      enabled() {
        return this.$cookies.get(this.cookieName) !== this.featureNotificationName;
      }
    },

    mounted() {
      if (!this.enabled) {
        return;
      }

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
