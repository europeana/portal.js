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
    <MediaPlayer
      v-else-if="isPlayableMedia"
      :europeana-identifier="europeanaIdentifier"
      :src="media.about"
      :type="media.ebucoreHasMimeType"
      :width="media.ebucoreWidth"
      :height="media.ebucoreHeight"
    />
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
    <iframe
      v-else-if="isIIIFImage || isIIIFPresentation"
      data-qa="IIIF viewer"
      allowfullscreen="true"
      :src="$path({ name: 'iiif', query: { uri: iiifManifest } })"
      :aria-label="$t('actions.viewDocument')"
    />
  </div>
</template>

<script>
  import MediaImage from './MediaImage';
  import VideoPlayer from '../../components/media/VideoPlayer';
  import MediaPlayer from '../../components/media/MediaPlayer';
  import AudioPlayer from '../../components/media/AudioPlayer';
  import HTMLEmbed from '../../components/generic/HTMLEmbed';

  import oEmbed from '../../plugins/oembed';
  import {
    isPlayableMedia, isHTMLVideo, isHTMLAudio, isIIIFImage, isIIIFPresentation,
    isOEmbed, isRichMedia, iiifManifest
  } from '../../plugins/media';

  export default {
    name: 'MediaPresentation',

    components: {
      MediaImage,
      VideoPlayer,
      MediaPlayer,
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
      imageSrc: {
        type: String,
        default: ''
      }
    },

    data() {
      return {
        oEmbedData: {}
      };
    },

    computed: {
      displayImage() {
        return (this.imageSrc !== '') && !isRichMedia(this.media, {
          iiif: Number(process.env.ENABLE_IIIF_MEDIA)
        });
      },
      isPlayableMedia() {
        if (!(process.env.EUROPEANA_MEDIA_ENDPOINT)) return false;
        return isPlayableMedia(this.media);
      },
      isHTMLVideo() {
        return isHTMLVideo(this.media);
      },
      isHTMLAudio() {
        return isHTMLAudio(this.media);
      },
      isIIIFImage() {
        if (!Number(process.env.ENABLE_IIIF_MEDIA)) return false;
        return isIIIFImage(this.media);
      },
      isIIIFPresentation() {
        if (!Number(process.env.ENABLE_IIIF_MEDIA)) return false;
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
    }
  };
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/variables.scss';

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
  }
</style>
