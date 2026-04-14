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
  import '@google/model-viewer';

  export default {
    props: {
      url: {
        type: String,
        required: true
      }
    }
  };
</script>
