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
  </div>
</template>

<script>
  import MediaImage from '../../components/record/MediaImage';
  import VideoPlayer from '../../components/media/VideoPlayer';

  export default {
    components: {
      MediaImage,
      VideoPlayer
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
    computed: {
      displayImage() {
        return (this.imageSrc !== '') && !this.isHTMLVideo;
      },
      isPDF() {
        return this.mimeType === 'application/pdf';
      },
      isHTMLVideo() {
        return (this.mimeType === 'video/ogg') ||
          (this.mimeType === 'video/webm') ||
          ((this.mimeType === 'video/mp4') && (this.codecName === 'h264'));
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
