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

  export default {
    name: 'MediaAudioVisualPlayer',

    inject: ['subtitlingAnnotations'],

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

      subtitlingAnnotations() {
        process.client && this.initTextTracks();
      }
    },

    beforeDestroy() {
      this.player?.dispose();
    },

    methods: {
      parseTimeToSeconds(time) {
        const splitMilliseconds = time.split(',');
        const milliseconds = new Number(splitMilliseconds[1]);
        const splitHoursMinutesSeconds = splitMilliseconds[0].split(':');
        const seconds = new Number(splitHoursMinutesSeconds[2]);
        const minutes = new Number(splitHoursMinutesSeconds[1]);
        const hours = new Number(splitHoursMinutesSeconds[0]);
        return (hours * 60 * 60) + (minutes * 60) + seconds + (milliseconds / 1_000);
      },

      parseSubtitles(input) {
        return input.trim().split(/[\r\n]{2,}/).map((seq) => seq.trim().split(/[\r\n]/)).map((seq) => {
          const timespan = seq[1].split(' --> ');

          const startTime = this.parseTimeToSeconds(timespan[0]);
          const endTime = this.parseTimeToSeconds(timespan[1]);

          return ({ start: startTime, end: endTime, text: seq[2] });
        });
      },

      initTextTracks() {
        if (!this.player || ((this.subtitlingAnnotations?.length || 0) === 0)) {
          return;
        }

        for (const anno of this.subtitlingAnnotations) {
          let textTrack;
          try {
            textTrack = this.player.addTextTrack('subtitles', anno.body.language?.toUpperCase(), anno.body.language);
          } catch {
            // the next return will handle the error quietly
          }

          if (!textTrack) {
            // player isn't ready; leave
            return;
          }

          const subtitles = this.parseSubtitles(anno.body.value);
          for (const subtitle of subtitles) {
            const cue = new VTTCue(subtitle.start, subtitle.end, subtitle.text);
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
