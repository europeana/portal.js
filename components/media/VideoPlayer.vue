<template>
  <video
    :controls="controls"
    :autoplay="autoplay"
    :loop="loop"
    :muted="muted"
  >
    <source
      :src="src"
      :type="type"
    >
  </video>
</template>

<script>
  export default {
    name: 'VideoPlayer',

    props: {
      src: {
        type: String,
        required: true
      },
      type: {
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
      }
    }
  };
</script>

<style lang="scss" scoped>
  video {
    width: 100%;
  }
</style>
