<template>
  <div
    id="viewer-controls"
    class="viewer-controls d-inline-flex align-items-center mx-auto"
  >
    <b-button
      v-b-tooltip.top="$t('media.controls.zoomIn')"
      :disabled="atMaxZoom"
      :aria-label="$t('media.controls.zoomIn')"
      variant="light-flat"
      class="button-icon-only btn-light-flat mr-2"
      @click="$emit('zoomIn')"
      @mouseleave="hideTooltips"
    >
      <span
        class="icon icon-zoom-in"
      />
    </b-button>
    <b-button
      v-b-tooltip.top="$t('media.controls.resetZoom')"
      :disabled="atDefaultZoom"
      :aria-label="$t('media.controls.resetZoom')"
      variant="light-flat"
      class="button-icon-only btn-light-flat mr-2"
      @click="$emit('resetZoom')"
      @mouseleave="hideTooltips"
    >
      <span
        class="icon icon-reset"
      />
    </b-button>
    <b-button
      v-b-tooltip.top="$t('media.controls.zoomOut')"
      :disabled="atMinZoom"
      :aria-label="$t('media.controls.zoomOut')"
      variant="light-flat"
      class="button-icon-only btn-light-flat mr-3"
      @click="$emit('zoomOut')"
      @mouseleave="hideTooltips"
    >
      <span
        class="icon icon-zoom-out"
      />
    </b-button>
    <span class="divider" />
    <b-button
      v-b-tooltip.top="fullscreen ? $t('media.controls.exitFullscreen') : $t('media.controls.fullscreen')"
      :aria-label="fullscreen ? $t('media.controls.exitFullscreen') : $t('media.controls.fullscreen')"
      variant="light-flat"
      class="fullscreen-button button-icon-only btn-light-flat ml-3"
      @click="$emit('toggleFullscreen')"
      @mouseleave="hideTooltips"
    >
      <span
        class="icon"
        :class="fullscreen ? 'icon-fullscreen-exit' : 'icon-fullscreen'"
      />
    </b-button>
  </div>
</template>

<script>
  import hideTooltips from '@/mixins/hideTooltips';

  export default {
    name: 'MediaImageViewerControls',

    mixins: [hideTooltips],

    props: {
      minZoom: {
        type: Number,
        default: null
      },
      maxZoom: {
        type: Number,
        default: null
      },
      defaultZoom: {
        type: Number,
        default: null
      },
      currentZoom: {
        type: Number,
        default: null
      },
      fullscreen: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {};
    },

    computed: {
      atDefaultZoom() {
        return this.currentZoom === this.defaultZoom;
      },
      atMaxZoom() {
        return this.currentZoom >= this.maxZoom;
      },
      atMinZoom() {
        return this.currentZoom <= this.minZoom;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .viewer-controls {
    .btn {
      &.disabled {
        opacity: 1;
        color: $middlegrey;
      }

      &:focus {
        box-shadow: none;
        border: none;
      }
    }

    .divider {
      width: 1px;
      height: 1rem;
      background: $middlegrey;
    }
  }
</style>
