<template>
  <div
    id="viewer-controls"
    class="viewer-controls ml-auto mr-auto"
  >
    <b-button
      v-b-tooltip.top="$t('media.controls.zoomIn')"
      :disabled="atMaxZoom"
      :aria-label="$t('media.controls.zoomIn')"
      variant="light-flat"
      class="button-icon-only btn-light-flat"
      @click="$emit('zoomIn')"
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
      class="button-icon-only btn-light-flat"
      @click="$emit('resetZoom')"
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
      class="button-icon-only btn-light-flat"
      @click="$emit('zoomOut')"
    >
      <span
        class="icon icon-zoom-out"
      />
    </b-button>
    <b-button
      v-b-tooltip.top="fullscreen ? $t('media.controls.exitFullscreen') : $t('media.controls.fullscreen')"
      :aria-label="fullscreen ? $t('media.controls.exitFullscreen') : $t('media.controls.fullscreen')"
      variant="light-flat"
      class="fullscreen-button button-icon-only btn-light-flat"
      @click="$emit('toggleFullscreen')"
    >
      <span
        class="icon"
        :class="fullscreen ? 'icon-fullscreen-exit' : 'icon-fullscreen'"
      />
    </b-button>
  </div>
</template>

<script>
  export default {
    name: 'MediaImageViewerControls',

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
    display: inline-flex;

    .btn {
      &:focus {
        box-shadow: none;
        border: none;
      }
    }

    .fullscreen-button {
      padding-left: 1rem;
      position: relative;
      &:before {
        content: '';
        width: 2px;
        height: 1.5rem;
        background: $lightgrey;
        display: inline;
        position: absolute;
        left: 0;
      }
    }
  }

</style>
