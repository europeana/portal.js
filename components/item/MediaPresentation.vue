<template>
  <div
    class="text-left text-lg-center mb-3"
  >
    <MediaImage
      v-if="displayImage"
      :europeana-identifier="europeanaIdentifier"
      :image-src="imageSrc"
      :media="media"
    />
    <div
      v-else-if="isPlayableMedia"
      ref="player"
      class="media-player-wrapper"
      :style="{ paddingTop: `${ratio}%` }"
    >
      <iframe
        data-qa="media player"
        allowfullscreen="true"
        :src="$path({ name: 'media', query: { id: europeanaIdentifier, mediaUrl: media.about, mediaType: media.ebucoreHasMimeType } })"
        class="media-player"
      />
    </div>
    <VideoPlayer
      v-else-if="isHTMLVideo"
      :europeana-identifier="europeanaIdentifier"
      :src="media.about"
      :type="media.ebucoreHasMimeType"
      :width="media.ebucoreWidth"
      :height="media.ebucoreHeight"
    />
    <AudioPlayer
      v-else-if="isHTMLAudio"
      :europeana-identifier="europeanaIdentifier"
      :src="media.about"
      :type="media.ebucoreHasMimeType"
    />
    <HTMLEmbed
      v-else-if="isOEmbed"
      :html="oEmbedData.html"
      :error="oEmbedData.error"
    />
    <template
      v-else-if="isIIIFImage || isIIIFPresentation"
    >
      <p
        v-if="showSadNotice"
        class="iiif-sadness has-text-highlight"
      >
        Updated Friday 23 October 2020: We are currently suffering an outage with our Newspaper services. We are working hard to resolve this and apologise for the inconvenience. This outage may span several days.
      </p>
      <iframe
        data-qa="IIIF viewer"
        allowfullscreen="true"
        :src="$path({ name: 'iiif', query: { uri: iiifManifest } })"
        :aria-label="$t('actions.viewDocument')"
      />
    </template>
  </div>
</template>

<script>
  import MediaImage from './MediaImage';
  import VideoPlayer from '../../components/media/VideoPlayer';
  import AudioPlayer from '../../components/media/AudioPlayer';
  import HTMLEmbed from '../../components/generic/HTMLEmbed';

  import oEmbed from '../../plugins/oembed';
  import {
    isHTMLVideo, isHTMLAudio, isIIIFImage, isIIIFPresentation,
    isOEmbed, isRichMedia, iiifManifest
  } from '../../plugins/media';

  export default {
    name: 'MediaPresentation',

    components: {
      MediaImage,
      VideoPlayer,
      AudioPlayer,
      HTMLEmbed
    },

    props: {
      europeanaIdentifier: {
        type: String,
        required: true
      },
      media: {
        type: Object,
        required: true
      },
      isPlayableMedia: {
        type: Boolean,
        default: false
      },
      imageSrc: {
        type: String,
        default: ''
      }
    },

    data() {
      return {
        oEmbedData: {},
        ratio: 56.25
      };
    },

    computed: {
      showSadNotice() {
        return Boolean(Number(process.env.ENABLE_SAD_IIIF_NOTICE)) &&
          this.iiifManifest.startsWith('https://iiif.europeana.eu/presentation/');
      },
      displayImage() {
        return (this.imageSrc !== '') && !isRichMedia(this.media);
      },
      isHTMLVideo() {
        return isHTMLVideo(this.media);
      },
      isHTMLAudio() {
        return isHTMLAudio(this.media);
      },
      isIIIFImage() {
        return isIIIFImage(this.media);
      },
      isIIIFPresentation() {
        return isIIIFPresentation(this.media);
      },
      iiifManifest() {
        return iiifManifest(this.media, this.europeanaIdentifier);
      },
      isOEmbed() {
        return isOEmbed(this.media);
      }
    },

    created() {
      if (this.isOEmbed) {
        oEmbed(this.media.about).then((response) => {
          if (response.data && response.data.html) {
            this.oEmbedData = response.data;
          } else {
            this.oEmbedData = { error: this.$t('messages.externalContentError') };
          }
        }).catch((err) => {
          this.oEmbedData = { error: err };
        });
      }
    },

    mounted() {
      if (this.isPlayableMedia) {
        const width = this.media.ebucoreWidth ? this.media.ebucoreWidth : 640;
        const height = this.media.ebucoreHeight ? this.media.ebucoreHeight : 360;
        this.ratio = (height * 100) / width;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/variables.scss';

  .iiif-sadness {
    text-align: left;
  }

  /* TODO: fixed max height is subject to change */
  .media-presentation {
    /deep/ img,
    video {
      height: auto;
      max-height: 800px;
      object-fit: contain;
      width: 100%;
    }

    iframe:not(.media-player) {
      height: 80vh;
      border: 1px solid $lightgrey;
      border-radius: $border-radius-small;
      box-shadow: $boxshadow-small;
      max-height: 800px;
      width: 100%;
    }

    .media-player-wrapper {
      position: relative;
      height: 0;
      overflow: hidden;
      width: 100%;

      iframe {
        border: 0;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
