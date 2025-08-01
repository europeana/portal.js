<template>
  <div class="media-wrapper">
    <div
      ref="player"
    />
  </div>
</template>

<script>
  import WebResource from '@/plugins/europeana/edm/WebResource';

  export default {
    name: 'MediaPage',

    layout: 'minimal',

    data() {
      return {
        MEDIA_PLAYER_VERSION: '0.9.2',
        JQUERY_VERSION: '3.4.1',
        JQUERY_UI_VERSION: '1.12.1',
        DASHJS_VERSION: '2.9.0',
        id: this.$route.query.id,
        mediaUrl: this.$route.query.mediaUrl,
        mediaType: this.$route.query.mediaType,
        mediaPlayer: null
      };
    },

    head() {
      return {
        meta: [
          { hid: 'title', name: 'title', content: 'Media player' }
        ],

        link: [
          { rel: 'preload', as: 'style', href: `https://code.jquery.com/ui/${this.JQUERY_UI_VERSION}/themes/base/jquery-ui.css` },
          { rel: 'stylesheet', href: `https://code.jquery.com/ui/${this.JQUERY_UI_VERSION}/themes/base/jquery-ui.css` }
        ],

        script: [
          { src: `https://code.jquery.com/jquery-${this.JQUERY_VERSION}.min.js` },
          { src: `https://code.jquery.com/ui/${this.JQUERY_UI_VERSION}/jquery-ui.min.js` },
          { src: `https://cdn.jsdelivr.net/npm/@europeana/media-player@${this.MEDIA_PLAYER_VERSION}/dist/europeana-media-player.min.js` }
        ].concat(this.dashRequired ? [
          { src: `https://cdn.jsdelivr.net/npm/dashjs@${this.DASHJS_VERSION}/dist/dash.all.min.js` }
        ] : [])
      };
    },

    computed: {
      manifest() {
        const manifestUrl = new URL(`/presentation${this.id}/manifest`, this.$apis.iiifPresentation.baseURL);
        manifestUrl.searchParams.set('format', '3');
        manifestUrl.searchParams.set('recordApi', new URL(this.$apis.record.baseURL).origin);
        return manifestUrl.toString();
      },

      dashRequired() {
        return new WebResource({ ebucoreHasMimeType: this.mediaType }).requiresDashJS;
      }
    },

    mounted() {
      this.$nextTick(() => {
        this.mediaPlayer = new EuropeanaMediaPlayer(this.$refs.player, { // eslint-disable-line no-undef
          manifest: this.manifest,
          mediaItem: this.mediaUrl
        });
      });
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
