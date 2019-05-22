<template>
  <div
    id="playerElement"
    alt="The media player"
  >
    player
  </div>
</template>

<script>
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
      success () {
        const container = document.getElementById('playerElement');
        new this.$EuropeanaMediaPlayer(container, this.videoObj);
      }
    }
  };
</script>
