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
        :href="url"
        target="_blank"
      >
        {{ $t('record.view.pdf') }}
      </b-link>
    </p>
    <VideoPlayer
      v-else-if="isHTMLVideo"
      :src="url"
      :type="mimeType"
      :width="width"
      :height="height"
    />
    <AudioPlayer
      v-else-if="isHTMLAudio"
      :src="url"
      :type="mimeType"
    />
    <HTMLEmbed
      v-else-if="isOEmbed"
      :html="oEmbedData.html"
      :error="oEmbedData.error"
    />
    <div
      v-else-if="isIIIFImage"
    >
      <strong>IIIF</strong>
    </div>
  </div>
</template>

<script>
  import MediaImage from '../../components/record/MediaImage';
  import VideoPlayer from '../../components/media/VideoPlayer';
  import AudioPlayer from '../../components/media/AudioPlayer';
  import HTMLEmbed from '../../components/generic/HTMLEmbed';

  import oEmbed from '../../plugins/oembed.js';
  import { isHTMLVideo, isHTMLAudio, isIIIFImage, isOEmbed, isPDF, isRichMedia } from '../../plugins/media.js';

  export default {
    name: 'MediaPresentation',

    components: {
      MediaImage,
      VideoPlayer,
      AudioPlayer,
      HTMLEmbed
    },

    props: {
      codecName: {
        type: String,
        default: ''
      },
      imageLink: {
        type: String,
        default: ''
      },
      imageSrc: {
        type: String,
        default: ''
      },
      mimeType: {
        type: String,
        default: ''
      },
      url: {
        type: String,
        default: ''
      },
      width: {
        type: Number,
        default: null
      },
      height: {
        type: Number,
        default: null
      },
      services: {
        type: Array,
        default: () => []
      }
    },

    data() {
      return {
        oEmbedData: {}
      };
    },

    computed: {
      displayImage() {
        return (this.imageSrc !== '') && !isRichMedia(this.mimeType, this.codecName, this.url, this.services);
      },
      isPDF() {
        return isPDF(this.mimeType);
      },
      isHTMLVideo() {
        return isHTMLVideo(this.mimeType, this.codecName);
      },
      isHTMLAudio() {
        return isHTMLAudio(this.mimeType);
      },
      isIIIFImage() {
        return isIIIFImage(this.services);
      },
      isOEmbed() {
        return isOEmbed(this.url);
      }
    },

    created() {
      if (this.isOEmbed) {
        oEmbed(this.url).then((response) => {
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
