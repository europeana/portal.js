<template>
  <div
    id="viewer-controls"
    class="viewer-controls position-absolute d-inline-flex align-items-center justify-content-center mx-auto"
  >
    <b-button
      :id="rotateLeftButtonId"
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
      :id="rotateRightButtonId"
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
      :id="zoomInButtonId"
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
      :id="resetZoomButtonId"
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
      :id="zoomOutButtonId"
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
      :id="fullscreenButtonId"
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
      const rotateLeftButtonId = 'media-image-viewer-controls-rotate-left-button';
      const rotateRightButtonId = 'media-image-viewer-controls-rotate-right-button';
      const zoomInButtonId = 'media-image-viewer-controls-zoom-in-button';
      const resetZoomButtonId = 'media-image-viewer-controls-reset-zoom-button';
      const zoomOutButtonId = 'media-image-viewer-controls-zoom-out-button';
      const fullscreenButtonId = 'media-image-viewer-controls-fullscreen-button';

      const { hideTooltips } = useHideTooltips([
        rotateLeftButtonId, rotateRightButtonId, zoomInButtonId, resetZoomButtonId, zoomOutButtonId, fullscreenButtonId
      ]);
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

      return {
        atDefaultZoom,
        atMaxZoom,
        atMinZoom,
        fullscreenButtonId,
        hideTooltips,
        resetZoom,
        resetZoomButtonId,
        rotateLeftButtonId,
        rotateLess,
        rotateMore,
        rotateRightButtonId,
        zoomIn,
        zoomInButtonId,
        zoomOut,
        zoomOutButtonId
      };
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
