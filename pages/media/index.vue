<template>
  <div class="media-wrapper">
    <div
      ref="player"
    />
  </div>
</template>

<script>
  export default {
    layout: 'minimal',

    data() {
      return {
        // TODO: version and use unpkg with @europeana/media-player pkg, when available
        MEDIA_PLAYER_SRC: 'https://ec-3505-media-player.eu-de.mybluemix.net/europeana-media-player.min.js'
      };
    },

    computed: {
      manifest() {
        return `https://iiif.europeana.eu/presentation/${this.id}/manifest?format=3`;
      }
    },

    asyncData({ query }) {
      return {
        id: query.id
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
          { src: 'https://code.jquery.com/jquery-3.4.1.min.js' },
          { src: 'https://code.jquery.com/ui/1.12.1/jquery-ui.min.js' },
          { src: this.MEDIA_PLAYER_SRC }
        ]
      };
    }
  };
</script>

<style lang="scss" scoped>
  .media-wrapper {
    > div {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
</style>
