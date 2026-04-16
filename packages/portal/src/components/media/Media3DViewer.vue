<template>
  <!--
    use of key is a hack to force re-rendering when url changes,
    so that previous model does not persist in display until new
    one is loaded
  -->
  <model-viewer
    v-if="interacted"
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
  <b-button
    v-else
    class="play-button w-100 h-100 d-flex align-items-center justify-content-center"
    variant="light-flat"
  >
    <span
      class="icon-play"
      @click="() => interacted = true"
    />
  </b-button>
</template>

<script>
  // model-viewer docs: https://modelviewer.dev/docs/index.html
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
        loaded: false,
        interacted: false
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
        this.interacted = false;
      }
    },

    methods: {
      handleLoad() {
        this.loaded = true;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .play-button {
    background-color: transparent;
    color: $white;

    .icon-play {
      cursor: pointer;
      font-size: 4rem;
      padding: 1rem;
      line-height: 1;
      border-radius: 50%;
      border: 2px solid $white;
      transition: all $standard-transition;
    }

    &:hover .icon-play {
      background-color: $white;
      color: $black;
      transition: all $standard-transition;
    }
  }
</style>
