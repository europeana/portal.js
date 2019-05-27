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
      videoObj: {
        type: Object,
        default: () => {
          return {
            source: 'https://videoeditor.noterik.com/manifest/05_synchronised_av_text.json',
            duration: 120,
            id: '05_synchronized_av_test.json'
          };
        }
      }
    },
    created () {
      if (process.browser) {
        const container = document.getElementById('playerElement');
        container.addEventListener('click', this.initPlayer, container);
        //createPlayer(container));
      }
    },
    beforeUpdate () {
      if (process.browser) {
        const container = document.getElementById('playerElement');
        container.addEventListener('click', this.initPlayer(container));
        //createPlayer(container));
        //this.initPlayer(container));
      }
    },
    methods: {
      initPlayer (container) {
        const EuropeanaMediaPlayer = require('europeana-media-player');
        console.log(EuropeanaMediaPlayer);
        new EuropeanaMediaPlayer(container, this.videoObj);
      }
    }
  };
</script>
