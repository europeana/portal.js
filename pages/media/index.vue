<template>
  <div>
    <div
      ref="player"
      :style="{ height: height + 'px' }"
    />
  </div>
</template>

<script>
  export default {
    layout: 'minimal',

    data() {
      return {
        MEDIA_PLAYER_BUILD_PATH: 'https://ec-3505-media-player.eu-de.mybluemix.net'
      };
    },

    computed: {
      manifest() {
        return `https://iiif.europeana.eu/presentation/${this.id}/manifest?format=3`;
      }
    },

    asyncData({ query }) {
      return {
        id: query.id,
        height: query.height
      };
    },

    mounted() {
      this.$nextTick(() => {
        new EuropeanaMediaPlayer(this.$refs.player, { // eslint-disable-line no-undef
          manifest: this.manifest
        });
      });
    },

    head() {
      return {
        title: 'Media player',

        script: [
          { src: `${this.MEDIA_PLAYER_BUILD_PATH}/EuropeanaMediaPlayer.js` }
        ]
      };
    }
  };
</script>
