<template>
  <model-viewer
    v-if="url"
    alt=""
    :src="url"
    poster=""
    shadow-intensity="1"
    camera-controls
    touch-action="pan-y"
    class="h-100 w-100"
  />
</template>

<script>
  export default {
    props: {
      url: {
        type: String,
        required: true
      }
    },

    head() {
      return {
        script: [
          { src: 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.2.0/model-viewer.min.js', type: 'module' }
        ],
      };
    }
  }
</script>
