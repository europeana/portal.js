<template>
  <div
    id="viewer-controls"
    class="viewer-controls position-absolute d-inline-flex align-items-center justify-content-center mx-auto"
  >
    <b-button
      v-b-tooltip.top="$t('media.controls.rotateLeft')"
      :aria-label="$t('media.controls.rotateLeft')"
      variant="dark-flat"
      class="button-icon-only mr-2"
      @click="rotateLess"
      @mouseleave="hideTooltips"
    >
      <span
        class="icon icon-rotate-left"
      />
    </b-button>
    <b-button
      v-b-tooltip.top="$t('media.controls.rotateRight')"
      :aria-label="$t('media.controls.rotateRight')"
      variant="dark-flat"
      class="button-icon-only mr-2"
      @click="rotateMore"
      @mouseleave="hideTooltips"
    >
      <span
        class="icon icon-rotate-right"
      />
    </b-button>
    <span class="divider" />
    <b-button
      v-b-tooltip.top="$t('media.controls.zoomIn')"
      :disabled="atMaxZoom"
      :aria-label="$t('media.controls.zoomIn')"
      variant="dark-flat"
      class="button-icon-only ml-3 mr-2"
      @click="zoomIn"
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
      variant="dark-flat"
      class="button-icon-only mr-2"
      @click="resetZoom"
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
      variant="dark-flat"
      class="button-icon-only mr-3"
      @click="zoomOut"
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
      variant="dark-flat"
      class="fullscreen-button button-icon-only ml-3"
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
  import useHideTooltips from '@/composables/hideTooltips.js';
  import useRotation from '@/composables/rotation.js';
  import useZoom from '@/composables/zoom.js';

  export default {
    name: 'MediaImageViewerControls',

    props: {
      fullscreen: {
        type: Boolean,
        default: false
      }
    },

    setup() {
      const { hideTooltips } = useHideTooltips();
      const {
        rotateLess,
        rotateMore
      } = useRotation();
      const {
        atMin: atMinZoom,
        atMax: atMaxZoom,
        atDefault: atDefaultZoom,
        reset: resetZoom,
        zoomIn,
        zoomOut
      } = useZoom();

      return { atMinZoom, atMaxZoom, atDefaultZoom, hideTooltips, resetZoom, rotateLess, rotateMore, zoomIn, zoomOut };
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .viewer-controls {
    background-color: rgba($black, 0.7);
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 1;
    padding: 0.875rem 1rem;

    .divider {
      border-color: $darkgrey-light;
    }
  }
</style>
