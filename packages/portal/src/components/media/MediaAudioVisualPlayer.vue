<template>
  <div
    class="media-player-wrapper"
  >
    <component
      :is="format.startsWith('audio/') ? 'audio' : 'video'"
      :key="url"
      ref="avPlayer"
      class="media-player video-js"
      controls
      :title="$t('record.mediaPlayer')"
      :poster="poster"
    />
  </div>
</template>

<script>
  import videojs from 'video.js';
  // TODO: consider if this is needed when overriding styles
  import 'video.js/dist/video-js.min.css';

  export default {
    name: 'MediaAudioVisualPlayer',

    props: {
      format: {
        type: String,
        default: null
      },

      itemId: {
        type: String,
        default: null
      },

      poster: {
        type: String,
        default: null
      },

      url: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        options: {
          controlBar: {
            // defines which controls to display and in which order
            children: [
              'playToggle',
              'remainingTimeDisplay',
              'muteToggle',
              'volumeControl',
              'progressControl',
              'subtitlesButton',
              'subsCapsButton',
              'fullscreenToggle'
            ]
          }
        },
        player: null
      };
    },

    mounted() {
      this.player = videojs(this.$refs.avPlayer, {
        ...this.options,
        sources: [
          {
            src: this.url,
            type: this.format
          }
        ]
      });

      // TODO: use our own translations?
      const translationsInCurrentLocale = require(`video.js/dist/lang/${this.$i18n.locale}.json`);
      videojs.addLanguage(this.$i18n.locale, translationsInCurrentLocale);
    },

    beforeDestroy() {
      if (this.player) {
        this.player.dispose();
      }
    }
  };
</script>

<style lang="scss" scoped>
  .media-player-wrapper {
    height: 100%;
  }

  .media-player {
    display: block;
    height: 100%;
    width: auto;
    margin-right: auto;
    margin-left: auto;
  }
</style>
