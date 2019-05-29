<template>
  <div
    id="playerElement"
    title="The media player"
  />
</template>
<script>
  export default {
    props: {
      source: {
        type: Object,
        default: () => {}
      }
    },
    created () {
      console.log('created');
      if (process.browser) {
        this.initPlayer();
      }
    },
    methods: {
      videoObject: function() {
        return {
          source: this.source.url,
          duration: this.source.duration,
          id: this.source.url
        };
      },
      initPlayer () {
        let component = document.getElementById('playerElement');
        const EuropeanaMediaPlayer = require('europeana-media-player').default;
        new EuropeanaMediaPlayer(component, this.videoObject());
      }
    }
  };
</script>
