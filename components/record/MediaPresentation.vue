<template>
  <div>
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
    <p
      v-else-if="isHTMLVideo"
    >
      [Video player]
    </p>
  </div>
</template>

<script>
  import MediaImage from '../../components/record/MediaImage';

  export default {
    components: {
      MediaImage
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
      }
    },
    computed: {
      displayImage: function() {
        return (this.imageSrc !== '') && !this.isHTMLVideo;
      },
      isPDF: function() {
        return this.mimeType == 'application/pdf';
      },
      isHTMLVideo: function () {
        return (this.mimeType == 'video/ogg') ||
          (this.mimeType == 'video/webm') ||
          (this.mimeType == 'video/mp4' && this.codecName == 'h264');
      }
    }
  };
</script>
