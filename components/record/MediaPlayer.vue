<template>
  <div
    id="playerElement"
    alt="The media player"
  >
    player
  </div>
</template>

<script>
  //import EuropeanaMediaPlayer from 'europeana-media-player';

  export default {
    props: {
      source: {
        type: String,
        default: ''
      }
    },
    created () {
      console.log('created');
      if (process.browser) {
        const container = document.getElementById('playerElement');
        container.addEventListener('click', this.initPlayer, container);
        //createPlayer(container));
      }
    },
    beforeUpdate () {
      console.log('beforeUpdate');
      if (process.browser) {
        const container = document.getElementById('playerElement');
        container.addEventListener('click', this.initPlayer, container);
        //createPlayer(container));
        //this.initPlayer(container));
      }
    },
    methods: {
      videoObject: function() {
        return {
          source: this.source,
          duration: 120,
          id: '05_synchronized_av_test.json'
        };
      },
      initPlayer (container) {
        console.log(container);
        const EuropeanaMediaPlayer = require('europeana-media-player').default;
        new EuropeanaMediaPlayer(document.getElementById('playerElement'), this.videoObject());
      }
    }
  };
</script>
