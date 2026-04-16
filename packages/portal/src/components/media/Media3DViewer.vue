<template>
  <!--
    use of key is a hack to force re-rendering when url changes,
    so that previous model does not persist in display until new
    one is loaded
  -->
  <model-viewer
    :key="`model-viewer-${url}`"
    alt=""
    :src="url"
    :poster="poster"
    shadow-intensity="1"
    camera-controls
    touch-action="pan-y"
    class="h-100 w-100"
    @load="handleLoad"
  >
    <LoadingSpinner
      v-if="!loaded"
      class="text-white h-100 d-flex align-items-center justify-content-center"
      size="lg"
    />
  </model-viewer>
</template>

<script>
  // model-viewer docs: https://modelviewer.dev/docs/index.html
  // TODO: only load model after initial user interaction
  import LoadingSpinner from '../generic/LoadingSpinner.vue';

  export default {
    components: {
      LoadingSpinner
    },

    props: {
      poster: {
        type: String,
        default: null
      },

      url: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        loaded: false
      };
    },

    head() {
      return {
        script: [
          { src: 'https://cdn.jsdelivr.net/npm/@google/model-viewer@4.2.0/dist/model-viewer.min.js', type: 'module' }
        ]
      };
    },

    watch: {
      url() {
        this.loaded = false;
      }
    },

    methods: {
      handleLoad() {
        this.loaded = true;
      }
    }
  };
</script>
