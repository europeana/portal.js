<template>
  <div
    class="text-left text-lg-center mb-3"
  >
    <MediaImage
      v-if="displayImage"
      :link="imageLink"
      :src="imageSrc"
    />
    <p
      v-if="isPDF"
    >
      <b-link
        :href="media.about"
        target="_blank"
      >
        {{ $t('record.view.pdf') }}
      </b-link>
    </p>
    <VideoPlayer
      v-else-if="isHTMLVideo"
      :src="media.about"
      :type="media.ebucoreHasMimeType"
      :width="media.ebucoreWidth"
      :height="media.ebucoreHeight"
    />
    <AudioPlayer
      v-else-if="isHTMLAudio"
      :src="media.about"
      :type="media.ebucoreHasMimeType"
    />
    <HTMLEmbed
      v-else-if="isOEmbed"
      :html="oEmbedData.html"
      :error="oEmbedData.error"
    />
    <div
      v-else-if="isIIIFImage"
    >
      <strong>IIIF Image</strong>
    </div>
    <div
      v-else-if="isIIIFPresentation"
    >
      <strong>IIIF Presentation</strong>
    </div>
  </div>
</template>

<script>
  import MediaImage from '../../components/record/MediaImage';
  import VideoPlayer from '../../components/media/VideoPlayer';
  import AudioPlayer from '../../components/media/AudioPlayer';
  import HTMLEmbed from '../../components/generic/HTMLEmbed';

  import oEmbed from '../../plugins/oembed.js';
  import {
    isHTMLVideo, isHTMLAudio, isIIIFImage, isIIIFPresentation, isOEmbed, isPDF, isRichMedia
  } from '../../plugins/media.js';

  export default {
    name: 'MediaPresentation',

    components: {
      MediaImage,
      VideoPlayer,
      AudioPlayer,
      HTMLEmbed
    },

    props: {
      media: {
        type: Object,
        required: true
      },
      imageLink: {
        type: String,
        default: ''
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
        return (this.imageSrc !== '') && !isRichMedia(this.media);
      },
      isPDF() {
        return isPDF(this.media);
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
  /* TODO: fixed max height is subject to change */
  .media-presentation {
    /deep/ img,
    video {
      height: auto;
      max-height: 800px;
      object-fit: contain;
      width: 100%;
    }
  }
</style>
