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
          // TODO: This removes 'bigPlayButton', but also breaks the play button and play/pause on poster click. Fix or hide in styles.
          // children: [
          //   'controlBar'
          // ],
          controlBar: {
            // defines which controls to display and in which order. Docs: https://legacy.videojs.org/guides/components/#default-component-tree
            children: [
              'playToggle',
              'currentTimeDisplay',
              'timeDivider',
              'durationDisplay',
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

<style lang="scss">
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/icon-font';

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

  .video-js {
    .vjs-big-play-button {
      width: 0;
      height: 0;
      opacity: 0;
    }

    .vjs-control-bar {
      display: flex;
      visibility: visible;
      opacity: 1;
      background-color: $black;
      height: 2.75rem;
    }

    .vjs-button > .vjs-icon-placeholder::before {
      position: static;
      font-size: 1.5rem;
    }

    .vjs-time-control {
      font-size: $font-size-extrasmall;
      padding: 0;
      min-width: 0;
    }

    .vjs-time-divider {
      margin-left: 0.25rem;
      margin-right: 0.25rem;
    }

    .vjs-current-time, .vjs-duration, .vjs-time-divider {
      display: flex;
      align-items: center;
    }

    .vjs-volume-control {
      align-items: center;
    }

    .vjs-progress-control {
      display: flex;
    }

    .vjs-fullscreen-control .vjs-icon-placeholder::before {
      @extend %icon-font;
      content: '\e95f';
    }
  }
</style>
