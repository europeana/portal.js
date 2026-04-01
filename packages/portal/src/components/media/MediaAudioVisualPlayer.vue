<template>
  <div
    class="media-player-wrapper h-100 d-flex justify-content-center"
  >
    <template
      v-if="mediaComponent"
    >
      <component
        :is="mediaComponent"
        :key="mediaUrl"
        ref="avPlayer"
        class="media-player video-js"
        controls
        preload="none"
      />
    </template>
  </div>
</template>

<script>
  import axios from 'axios';
  import videojs from 'video.js/dist/alt/video.core.min.js';
  // TODO: consider if this is needed when overriding styles
  import 'video.js/dist/video-js.min.css';

  import { ItemMediaPresentationSubtitleTrack } from '@/composables/subtitles.js';
  import { useEuScreen } from '@/composables/euScreen.js';

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

      subtitles: {
        type: Array,
        default: () => [],
        validator: (prop) => Array.isArray(prop) && prop.every((item) => item instanceof ItemMediaPresentationSubtitleTrack)
      },

      url: {
        type: String,
        required: true
      }
    },

    setup(props) {
      const { embedUrl: euScreenEmbedUrl } = useEuScreen(props.url);

      return { euScreenEmbedUrl };
    },

    data() {
      return {
        mediaFormat: null,
        mediaUrl: null,
        options: {
          controlBar: {
            // defines which controls to display and in which order. Docs: https://legacy.videojs.org/guides/components/#default-component-tree
            children: [
              'progressControl',
              'playToggle',
              'currentTimeDisplay',
              'timeDivider',
              'durationDisplay',
              'muteToggle',
              'volumeControl',
              'subtitlesButton',
              'subsCapsButton',
              'fullscreenToggle'
            ]
          },
          noUITitleAttributes: true,
          poster: this.poster
        },
        player: null
      };
    },

    async fetch() {
      if (this.euScreenEmbedUrl) {
        const response = await axios.get(this.euScreenEmbedUrl);

        this.mediaUrl = response.data.location;
        this.mediaFormat = response.data.format;
      } else {
        this.mediaUrl = this.url;
        this.mediaFormat = this.format;
      }
    },

    computed: {
      mediaComponent() {
        if (this.mediaFormat?.startsWith('audio/')) {
          return 'audio';
        } else if (this.mediaFormat?.startsWith('video/')) {
          return 'video';
        }
        return undefined;
      }
    },

    watch: {
      mediaComponent() {
        process.client && this.initVideojs();
      },

      subtitles() {
        process.client && this.initTextTracks();
      }
    },

    beforeDestroy() {
      this.player?.dispose();
    },

    methods: {
      initTextTracks() {
        if (!this.player || (this.subtitles.length === 0)) {
          return;
        }

        for (const track of this.subtitles) {
          let textTrack;
          try {
            textTrack = this.player.addTextTrack(track.kind, track.label, track.language);
          } catch {
            // the next return will handle the error quietly
          }

          if (!textTrack) {
            // player isn't ready; leave
            return;
          }

          for (const trackCue of track.cues) {
            const cue = new VTTCue(trackCue.startTime, trackCue.endTime, trackCue.text);
            cue.line = -2;
            textTrack.addCue(cue);
          }
        }
      },

      async initVideojs() {
        this.player?.dispose();

        // wait for the ref to be created and inserted into the DOM
        await this.$nextTick();

        if (!this.$refs.avPlayer) {
          return;
        }

        this.player = videojs(this.$refs.avPlayer, {
          ...this.options,
          languages: {
            // Adds custom translations. Docs: https://legacy.videojs.org/guides/languages/#per-player-translations
            [this.$i18n.locale]: this.$t('audioVisualPlayer')
          },
          sources: [
            {
              src: this.mediaUrl,
              type: this.mediaFormat
            }
          ]
        });

        this.player.ready(this.initTextTracks);
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/icon-font';

  .media-player.video-js {
    font-family: $font-family-sans-serif;
    height: 100%;
    min-width: 100%;

    @media (min-width: $bp-small) {
      min-width: 31.875rem;
    }

    @media (min-width: $bp-medium) {
      min-width: 43.125rem;
    }

    @media (min-width: $bp-large) {
      min-width: 48.125rem;
    }
    @media (min-width: $bp-extralarge) {
      min-width: 57.5rem;
    }

    .vjs-tech {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
      bottom: 0;
      right: 0;
      margin: auto;
    }

    .vjs-big-play-button {
      // Hide big play button
      width: 0;
      height: 0;
      opacity: 0;
    }

    &.vjs-has-started .vjs-poster {
      display: none;
    }

    .vjs-control-bar {
      display: flex;
      flex-wrap: wrap;
      visibility: visible;
      opacity: 1;
      background-color: $black;
      height: 3.25rem;
    }

    .vjs-control-text {
      position: absolute;
      top: -50%;
      background: $black;
      color: $white;
      padding: 0.5rem;
      border-radius: $border-radius-small;
      font-size: $font-size-small;
      font-weight: 400;
      text-align: center;
      line-height: 1.5;
      opacity: 0;
      z-index: 10;
      transition: opacity $standard-transition;
    }

    .vjs-progress-control,
    .vjs-play-control,
    .vjs-current-time,
    .vjs-duration,
    .vjs-mute-control,
    .vjs-volume-control {
      .vjs-control-text {
        left: 0;
      }
    }

    .vjs-subtitles-button,
    .vjs-subs-caps-button,
    .vjs-fullscreen-control {
      .vjs-control-text {
        right: 0;
      }
    }

    .vjs-control {
      position: relative;

      &:hover,
      &:focus {
        .vjs-control-text {
          opacity: 1;
          clip: unset;
          height: auto;
          border: 1px solid $lightgrey;
          width: max-content;
          max-width: min(100vw, pxToRem(200));
          transition: opacity $standard-transition;
        }
      }
    }

    .vjs-button > .vjs-icon-placeholder::before {
      position: static;
      font-size: 1.5rem;
    }

    .vjs-control:focus,
    .vjs-control:focus::before {
      text-shadow: none;
    }

    .vjs-time-tooltip,
    .vjs-volume-tooltip {
      border-radius: $border-radius-small;
      font-family: $font-family-sans-serif;
    }

    .vjs-time-tooltip {
      background-color: $white;
      color: $black;
      border: 1px solid $black;
    }

    .vjs-mouse-display {
      .vjs-time-tooltip,
      .vjs-volume-tooltip {
        color: $white;
        background-color: $black;
        border: 1px solid $white;
      }
    }

    .vjs-slider {
      background-color: $mediumgrey;

      &:focus {
        text-shadow: none;
        box-shadow: none;
      }
    }

    .vjs-progress-control {
      flex-basis: 100%;
      height: auto;

      .vjs-progress-holder {
        margin: 0;
        font-size: 1rem;
        height: 0.25rem;
      }

      &:hover {
        .vjs-time-tooltip {
          font-size: $font-size-smallest;
        }

        .vjs-progress-holder {
          font-size: 1rem;
        }
      }
    }

    .vjs-load-progress div {
      background-color: $lightgrey;
    }

    .vjs-play-progress {
      background-color: $blue;

      &::before {
        color: $blue;
        font-size: $font-size-extrasmall;
        line-height: 0.25rem;
      }
    }

    .vjs-play-control {
      @media (max-width: $bp-small) {
        margin-left: 1rem;
      }
    }

    .vjs-time-control {
      font-size: $font-size-extrasmall;
      font-weight: 600;
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
      width: 5rem;
      margin: 0 auto 0 0.5rem;

      .vjs-volume-bar.vjs-slider-horizontal {
        width: 5rem;
        margin: 0;

        .vjs-volume-level {
          height: 0.25rem;

          &:before {
            font-size: $font-size-extrasmall;
            line-height: 0.25rem;
          }
        }
      }
    }

    .vjs-fullscreen-control {
      @media (max-width: $bp-large) {
        margin-right: 1rem;
      }
    }

    .vjs-subtitles-button .vjs-icon-placeholder::before {
      @extend %icon-font;
      content: '\e976';
    }

    .vjs-subs-caps-button .vjs-icon-placeholder::before {
      @extend %icon-font;
      content: '\e974';
    }

    .vjs-fullscreen-control .vjs-icon-placeholder::before {
      @extend %icon-font;
      content: '\e95f';
    }

    .vjs-mute-control {
      .vjs-icon-placeholder::before,
      &.vjs-vol-2 .vjs-icon-placeholder::before {
        @extend %icon-font;
        content: '\e977';
      }
      &.vjs-vol-0 .vjs-icon-placeholder::before {
        @extend %icon-font;
        content: '\e978';
      }
    }

    &.vjs-fullscreen .vjs-fullscreen-control .vjs-icon-placeholder::before {
      @extend %icon-font;
      content: '\e960';
    }

    .vjs-play-control:not(.vjs-playing) .vjs-icon-placeholder::before {
      @extend %icon-font;
      content: '\e975';
    }
  }
</style>
