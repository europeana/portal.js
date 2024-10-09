<template>
  <div
    id="viewerControls"
    class="viewer-controls ml-auto mr-auto"
  >
    <b-button
      :disabled="atMaxZoom"
      @click="$emit('zoomIn')"
    >
      <span
        class="icon icon-zoom-in"
      />
    </b-button>
    <b-button
      :disabled="atDefaultZoom"
      @click="$emit('resetZoom')"
    >
      <span
        class="icon icon-reset"
      />
    </b-button>
    <b-button
      :disabled="atMinZoom"
      @click="$emit('zoomOut')"
    >
      <span
        class="icon icon-zoom-out"
      />
    </b-button>
    <b-button
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
    name: 'MediaImageViewerZoomControls',

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
        return this.currentZoom === this.maxZoom;
      },
      atMinZoom() {
        return this.currentZoom === this.minZoom;
      }
    }
  };
</script>
