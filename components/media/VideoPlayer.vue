<template>
  <video
    :controls="controls"
    :autoplay="autoplay"
    :loop="loop"
    :muted="muted"
    :width="width"
    :height="height"
    :src="src"
    data-qa="video"
  />
</template>

<script>
  export default {
    name: 'VideoPlayer',

    props: {
      src: {
        type: String,
        required: true
      },
      controls: {
        type: Boolean,
        default: true
      },
      autoplay: {
        type: Boolean,
        default: false
      },
      loop: {
        type: Boolean,
        default: false
      },
      muted: {
        type: Boolean,
        default: false
      },
      width: {
        type: Number,
        default: null
      },
      height: {
        type: Number,
        default: null
      }
    }
  };
</script>
