<template>
  <div>
    <div
      class="media-wrapper"
      :style="{ paddingTop: ratio + '%' }"
    >
      <div
        ref="player"
      />
    </div>
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
        ratio: query.ratio
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
          { src: `${this.MEDIA_PLAYER_BUILD_PATH}/europeana-media-player.min.js` }
        ]
      };
    }
  };
</script>

<style lang="scss" scoped>
  .media-wrapper {
    overflow: hidden;
    position: relative;

    > div {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
</style>
