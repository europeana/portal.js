<template>
  <div
    id="playerElement"
    title="The media player"
  />
</template>
<script>
  export default {
    props: {
      src: {
        type: String,
        default: null,
        require: true
      },
      duration: {
        type: Number,
        default: null,
        require: true
      }
    },
    created() {
      console.log('created');
      if (process.browser) {
        this.initPlayer();
      }
    },
    methods: {
      videoObject() {
        return {
          source: this.src,
          duration: this.duration,
          id: this.src
        };
      },
      initPlayer() {
        let component = document.getElementById('playerElement');
        const EuropeanaMediaPlayer = require('europeana-media-player').default;
        new EuropeanaMediaPlayer(component, this.videoObject());
      }
    }
  };
</script>
