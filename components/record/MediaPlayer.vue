<template>
  <div
    id="playerElement"
    alt="The media player"
  >
    player
  </div>
</template>

<script>
  import createPlayer from '../../plugins/europeana-media-player.js';

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
    asyncData () {
      return createPlayer();
    }
  };
</script>
