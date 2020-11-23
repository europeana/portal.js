<template>
  <div class="media-wrapper">
    <div
      ref="player"
    />
  </div>
</template>

<script>
  import { requiresDashJS } from '../../plugins/media';

  export default {
    layout: 'minimal',

    asyncData({ query }) {
      return {
        id: query.id,
        mediaUrl: query.mediaUrl,
        mediaType: query.mediaType
      };
    },

    data() {
      return {
        MEDIA_PLAYER_VERSION: '0.7.6',
        JQUERY_VERSION: '3.4.1',
        JQUERY_UI_VERSION: '1.12.1',
        DASHJS_VERSION: '2.9.0'
      };
    },

    computed: {
      manifest() {
        return `https://iiif.europeana.eu/presentation${this.id}/manifest?format=3`;
      },
      dashRequired() {
        return requiresDashJS(this.mediaType);
      }
    },

    mounted() {
      this.$nextTick(() => {
        new EuropeanaMediaPlayer(this.$refs.player, { // eslint-disable-line no-undef
          manifest: this.manifest,
          mediaItem: this.mediaUrl
        });
      });
    },

    head() {
      return {
        title: this.$pageHeadTitle('Media player'),
        link: [
          { rel: 'stylesheet', href: `https://code.jquery.com/ui/${this.JQUERY_UI_VERSION}/themes/base/jquery-ui.css` }
        ],

        script: [
          { src: `https://code.jquery.com/jquery-${this.JQUERY_VERSION}.min.js` },
          { src: `https://code.jquery.com/ui/${this.JQUERY_UI_VERSION}/jquery-ui.min.js` },
          { src: `https://unpkg.com/@europeana/media-player@${this.MEDIA_PLAYER_VERSION}/dist/europeana-media-player.min.js` }
        ].concat(this.dashRequired ? [
          { src: `https://unpkg.com/dashjs@${this.DASHJS_VERSION}/dist/dash.all.min.js` }
        ] : [])
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
