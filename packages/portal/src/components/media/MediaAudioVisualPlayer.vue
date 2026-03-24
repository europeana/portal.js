<template>
  <div
    class="media-player-wrapper"
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
        :title="$t('record.mediaPlayer')"
        :poster="poster"
        preload="none"
      />
    </template>
  </div>
</template>

<script>
  import axios from 'axios';
  import videojs from 'video.js';
  // TODO: consider if this is needed when overriding styles
  import 'video.js/dist/video-js.min.css';

  import { ItemMediaPresentationSubtitleTrack } from '@/composables/subtitles.js';

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

    data() {
      return {
        mediaFormat: null,
        mediaUrl: null,
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

    async fetch() {
      if (this.euScreenId) {
        const response = await axios.get(this.euScreenEmbedUrl);

        this.mediaUrl = response.data.location;
        this.mediaFormat = response.data.format;
      } else {
        this.mediaUrl = this.url;
        this.mediaFormat = this.format;
      }
    },

    computed: {
      isEUScreenMedia() {
        return this.url?.startsWith('http://www.euscreen.eu/item.html') ||
          this.url?.startsWith('https://www.euscreen.eu/item.html') ||
          false;
      },

      euScreenId() {
        return this.isEUScreenMedia && new URL(this.url).searchParams.get('id');
      },

      euScreenEmbedUrl() {
        return this.euScreenId && `https://euscreen.embd.eu/${this.euScreenId}`;
      },

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
