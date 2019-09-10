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
    <OEmbedMedia
      v-else-if="isOEmbed"
      :html="oEmbedData.html"
      :error="oEmbedData.error"
    />
  </div>
</template>

<script>
  import MediaImage from '../../components/record/MediaImage';
  import VideoPlayer from '../../components/media/VideoPlayer';
  import OEmbedMedia from '../../components/media/OEmbedMedia';

  import * as oembedParser from 'oembed-parser';
  import oEmbedProviderList from '../../plugins/oembed-parser/providers.json';
  oembedParser.setProviderList(oEmbedProviderList);

  export default {
    components: {
      MediaImage,
      VideoPlayer,
      OEmbedMedia
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
        return oembedParser.hasProvider(this.url);
      }
    },
    created() {
      if (this.isOEmbed) {
        oembedParser.extract(this.url).then((data) => {
          if (data && data.html) {
            this.oEmbedData = data;
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
