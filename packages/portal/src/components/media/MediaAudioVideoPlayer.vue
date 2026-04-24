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
      <MediaCardImage
        v-if="resource"
        ref="poster"
        class="poster-image"
        :resource="resource"
        :lazy="false"
        :offset="offset"
        :linkable="false"
        thumbnail-size="large"
      />
    </template>
  </div>
</template>

<script>
  import axios from 'axios';
  import videojs from 'video.js';
  // TODO: consider if this is needed when overriding styles
  import 'video.js/dist/video-js.min.css';

  import { ItemMediaPresentationTextTrack } from '@/composables/itemMediaTextTracks.js';
  import { useEuScreen } from '@/composables/euScreen.js';
  import EuropeanaMediaResource from '@/utils/europeana/media/Resource.js';
  import MediaCardImage from './MediaCardImage.vue';

  export class MediaAudioVideoPlayerError extends Error {
    constructor(message) {
      super(message);
      this.name = 'MediaAudioVideoPlayerError';
    }
  }

  const controlsWithTooltips = ['.vjs-mute-control',
                                '.vjs-fullscreen-control',
                                'button.vjs-subs-caps-button'];

  export default {
    name: 'MediaAudioVideoPlayer',

    components: {
      MediaCardImage
    },

    props: {
      resource: {
        type: EuropeanaMediaResource,
        default: null
      },

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

      textTracks: {
        type: Array,
        default: () => [],
        validator: (prop) => Array.isArray(prop) && prop.every((item) => item instanceof ItemMediaPresentationTextTrack)
      },

      offset: {
        type: Number,
        default: null
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
        // Docs: https://legacy.videojs.org/guides/options
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
              'subsCapsButton',
              'fullscreenToggle'
            ]
          },
          errorDisplay: false,
          language: this.$i18n.locale,
          noUITitleAttributes: true, // do not add title attributes to controls
          textTrackSettings: false // disable captions settings menu
        },
        player: null
      };
    },

    async fetch() {
      if (this.euScreenEmbedUrl) {
        try {
          const response = await axios.get(this.euScreenEmbedUrl);
          this.mediaUrl = response.data.location;
          this.mediaFormat = response.data.format;
        } catch (e) {
          this.$emit('error', e);
        }
      } else {
        this.mediaFormat = this.format;
        this.mediaUrl = this.url;
        // Use media-proxy when used for a europeana record, except for manifest-based media such as DASH videos
        if (this.itemId && (this.mediaFormat !== 'application/dash+xml')) {
          this.mediaUrl = this.$apis.record.mediaProxyUrl(this.url, this.itemId);
        }
      }
    },

    computed: {
      mediaComponent() {
        if (this.mediaFormat?.startsWith('audio/')) {
          return 'audio';
        } else if (this.mediaFormat?.startsWith('video/') || this.mediaFormat === 'application/dash+xml') {
          return 'video';
        }
        return undefined;
      }
    },

    watch: {
      mediaComponent() {
        process.client && this.initVideojs();
      },

      textTracks() {
        process.client && this.initTextTracks();
      }
    },

    beforeDestroy() {
      this.player?.dispose();
    },

    methods: {
      initTextTracks() {
        if (!this.player || (this.textTracks.length === 0)) {
          return;
        }

        for (const track of this.textTracks) {
          const trackLabel = this.$t(`audioVisualPlayer.${track.kind}Option`, { language: this.$t(`facets.LANGUAGE.options.${track.language.toLowerCase()}`) });
          let textTrack;
          try {
            textTrack = this.player.addTextTrack(track.kind, trackLabel, track.language);
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

      getControlsWithTooltips() {
        const playerElement = this.player.el();
        const elements = [];
        for (const control of controlsWithTooltips) {
          elements.push(playerElement.querySelector(control));
        }
        return elements.filter(Boolean);
      },

      // Handle custom hover state - hide tooltips on mouseleave
      initTooltips() {
        const controls = this.getControlsWithTooltips();
        for (const control of controls) {
          control.addEventListener('mouseenter', () => control.classList.add('show-tooltip'));
          control.addEventListener('mouseleave', () => {
            control.classList.remove('show-tooltip');
            control.blur();
          });
        }
      },

      initDuration() {
        if (![Infinity, NaN].includes(this.$refs.avPlayer.duration)) {
          return;
        }
        if (this.resource?.edm?.ebucoreDuration) {
          this.player.duration(Number(this.resource.edm.ebucoreDuration) / 1000 / 1000);
        }
      },

      setPosterWithCardImage() {
        const posterElement = this.player.el().querySelector('.vjs-poster');
        if (posterElement) {
          posterElement.appendChild(this.$refs.poster.$el);
          posterElement.classList.remove('vjs-hidden');
        }
      },

      onPlayerReady() {
        this.initTextTracks();
        this.initTooltips();
        this.setPosterWithCardImage();
      },

      checkSeekable() {
        const seekable = this.$refs.avPlayer.seekable;

        if ((seekable.length === 0) || ((seekable.start(0) === 0) && (seekable.end(0) === 0))) {
          this.$emit('warn', new MediaAudioVideoPlayerError('A/V not seekable'));

          this.disableProgressControl();
        }
      },

      disableProgressControl() {
        this.player.controlBar.progressControl.disable();
      },

      handlePlayerError() {
        this.$emit('error', this.player.error());
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

        this.player.ready(this.onPlayerReady);
        this.player.on('loadedmetadata', this.initDuration);
        this.player.on('loadedmetadata', this.checkSeekable);
        this.player.on('error', this.handlePlayerError);
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/icon-font';

  .poster-image {
    display: none;
  }

  .media-player.video-js {
    font-family: $font-family-sans-serif;
    height: 100%;
    width: 100%;

    // align player width with page content
    @media (min-width: $bp-small) {
      width: 31.875rem;
    }

    @media (min-width: $bp-medium) {
      width: 43.125rem;
    }

    @media (min-width: $bp-large) {
      width: 48.125rem;
    }
    @media (min-width: $bp-extralarge) {
      width: 57.5rem;
    }

    // let video render at intrinsic dimensions
    .vjs-tech {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
      bottom: 0;
      right: 0;
      margin: auto;
    }

    // Hide big play button
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
      height: 3.25rem;
    }

    .vjs-button > .vjs-icon-placeholder::before {
      position: static;
      font-size: $font-size-large;
    }

    .vjs-control:focus,
    .vjs-control:focus::before {
      text-shadow: none;
    }

    .vjs-time-tooltip {
      border-radius: $border-radius-small;
      font-family: $font-family-sans-serif;
      background-color: $white;
      color: $black;
      border: 1px solid $black;
    }

    .vjs-mouse-display {
      z-index: 2;

      .vjs-time-tooltip {
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

      &::before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        height: 2rem;
        bottom: -0.875rem;
        z-index: 1;
      }
    }

    .vjs-progress-control {
      position: absolute;
      top: -0.25rem;
      left: 0;
      right: 0;
      width: 100%;
      height: auto;

      .vjs-progress-holder {
        margin: 0;
        font-size: $font-size-base;
        height: 0.25rem;
      }

      &:hover {
        .vjs-time-tooltip {
          font-size: $font-size-smallest;
        }

        .vjs-progress-holder {
          font-size: $font-size-base;
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
      flex: 1 1 5rem; // allow to shrink on very small screen
      width: auto;
      margin: 0 auto 0 0.5rem;

      &:hover {
        .vjs-volume-mouse-display,
        .vjs-volume-tooltip {
          display: none;
        }
      }

      .vjs-volume-bar.vjs-slider-horizontal {
        width: min(5rem, 100%); // allow to shrink on very small screen
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

    .vjs-menu-button-popup {
      .vjs-menu {
        z-index: 3;

        .vjs-menu-content {
          font-family: $font-family-sans-serif;
          bottom: 2rem;
          right: 0rem;
          min-width: 10rem;
          padding: 0.5rem 0;
          margin: 0.125rem 0 0;
          background-color: $white;
          background-clip: padding-box;
          border: 1px solid rgba(0, 0, 0, 15%);
          border-radius: $border-radius-small;
          color: $black;
          width: max-content;
          max-height: 50vh;
          max-width: 90vw;

          li {
            justify-content: flex-start;
            padding: 0.25rem 1.5rem;
            line-height: 1.5;
            font-size: $font-size-small;
            text-align: left;
            text-transform: none;

            &.vjs-menu-item {
              &:hover,
              &:focus-visible {
                background-color: $lightgrey;
              }

              &.vjs-selected {
                color: $white;
                background-color: $blue;

                &:hover,
                &:focus {
                  color: $white;
                  background-color: $blue;
                }
              }
            }
          }
        }
      }

      // prevent menu showing on hover
      &.vjs-hover .vjs-menu {
        display: none;
      }
    }

    .vjs-captions-menu-item {
      .vjs-menu-item-text .vjs-icon-placeholder {
        line-height: 1;
        margin-left: 0.25rem;
        vertical-align: baseline;
      }

      .vjs-control-text {
        display: none; // Hide for assistive technologies (a11y)
      }
    }

    // --- Override icons with custom icons ---
    .vjs-subs-caps-button .vjs-icon-placeholder::before {
      @extend %icon-font;
      content: '\e976';
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

    .vjs-subs-caps-button + .vjs-menu .vjs-captions-menu-item .vjs-menu-item-text .vjs-icon-placeholder {
      line-height: 1;
      margin-left: 0.25rem;
      vertical-align: baseline;

      &:before {
        @extend %icon-font;
        content: '\e974';
      }
    }

    // --- Tooltip styles ---

    // Prevent tooltips from overflowing viewport
    .vjs-mute-control .vjs-control-text {
      left: 0;
    }

    .vjs-subs-caps-button,
    .vjs-fullscreen-control {
      .vjs-control-text {
        right: 0;
      }
    }

    // use control text as tooltip content
    .vjs-mute-control,
    .vjs-fullscreen-control,
    button.vjs-subs-caps-button {
      .vjs-control-text {
        position: absolute;
        bottom: 75%;
        background: $black;
        color: $white;
        padding: 0.5rem;
        border-radius: $border-radius-small;
        font-size: $font-size-small;
        font-weight: 400;
        text-align: center;
        line-height: 1.5;
        opacity: 0;
        transition: opacity $standard-transition;
      }
    }

    @mixin show-tooltip {
      opacity: 1;
      clip: unset;
      height: auto;
      border: 1px solid $lightgrey;
      width: max-content;
      max-width: min(100vw, pxToRem(200));
      transition: opacity $standard-transition;
      z-index: 10;
    }

    // show tooltips on hover and focus
    .vjs-mute-control,
    .vjs-fullscreen-control {
      position: relative;

      &.show-tooltip,
      &:focus {
        .vjs-control-text {
          @include show-tooltip;
        }
      }
    }

    button.vjs-subs-caps-button:not([aria-expanded='true']) {
      position: relative;

      &.show-tooltip,
      &:focus,
      .vjs-menu-button:focus {
        .vjs-control-text {
          @include show-tooltip;
        }

        // hide tooltips within subtitle menu
        .vjs-menu-content .vjs-control-text {
          opacity: 0;
          height: 0;
          border: 0;
          width: 0;
          z-index: -1;
        }
      }
    }

    .vjs-poster {
      .poster-image {
        display: flex;
      }

      .default-thumbnail [class^='icon-'] {
        color: $black;
      }
    }

    .disabled {
      cursor: not-allowed;
    }

    .vjs-loading-spinner {
      border-color: transparent;
      border-width: 0.25rem;
      width: 4rem;
      height: 4rem;

      &:before {
        border-color: $white;
        border-top-color: transparent;
      }

      &:after {
        content: none;
      }
    }

    &.vjs-seeking .vjs-loading-spinner:before,
    &.vjs-waiting .vjs-loading-spinner:before {
      animation: vjs-spinner-spin 0.75s linear infinite;
    }
  }
</style>
