<template>
  <VideoContainer
    v-if="playerType == 'video'"
    :url="url"
    :mime-type="mimeType"
    :image="image"
  />
</template>

<script>
  import VideoContainer from './VideoContainer';

  export default {
    components: {
      VideoContainer
    },
    props: {
      url: {
        type: String,
        default: ''
      },
      mimeType: {
        type: String,
        default: ''
      },
      playerType: {
        type: String,
        default: ''
      },
      image: {
        type: String,
        default: ''
      }
    }
  };
</script>
