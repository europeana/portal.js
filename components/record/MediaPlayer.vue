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
          duration: 200,
          id: 'test'
        };
      },
      initPlayer () {
        const EuropeanaMediaPlayer = require('europeana-media-player').default;
        new EuropeanaMediaPlayer(document.getElementById('playerElement'), this.videoObject());
      }
    }
  };
</script>
