<template>
  <div
    id="playerElement"
    alt="The media player"
  />
</template>

<script>
  const EuropeanaMediaPlayer = require('europeana-media-player');
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
    methods: {
      initPlayer() {
        let container = document.find('playerElement');
        new EuropeanaMediaPlayer(container, this.videoObj);
      }
    }
  };
</script>
