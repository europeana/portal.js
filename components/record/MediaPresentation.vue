<template>
  <div
    class="media-presentation text-center"
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
        View PDF
      </b-link>
    </p>
    <VideoPlayer
      v-else-if="isHTMLVideo"
      :src="url"
      :type="mimeType"
      :width="width"
      :height="height"
    />
    <HTMLEmbed
      v-else-if="isOEmbed"
      :html="oEmbedData.html"
      :error="oEmbedData.error"
    />
  </div>
</template>

<script>
  import MediaImage from '../../components/record/MediaImage';
  import VideoPlayer from '../../components/media/VideoPlayer';
  import HTMLEmbed from '../../components/generic/HTMLEmbed';

  import oEmbed, { oEmbeddable } from '../../plugins/oembed.js';

  export default {
    components: {
      MediaImage,
      VideoPlayer,
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
      }
    },
    data() {
      return {
        oEmbedData: {}
      };
    },
    computed: {
      displayImage() {
        return (this.imageSrc !== '') && !this.isHTMLVideo && !this.isOEmbed;
      },
      isPDF() {
        return this.mimeType === 'application/pdf';
      },
      isHTMLVideo() {
        return (this.mimeType === 'video/ogg') ||
          (this.mimeType === 'video/webm') ||
          ((this.mimeType === 'video/mp4') && (this.codecName === 'h264'));
      },
      isOEmbed() {
        return oEmbeddable(this.url);
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
  .media-presentation {
    /deep/ img,
    video {
      max-height: 70vh;
      max-width: 100%;
      width: auto;
    }
  }
</style>
