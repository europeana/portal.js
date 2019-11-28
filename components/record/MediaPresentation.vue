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
    <MediaPlayer
      v-else-if="isPlayableMedia"
      :identifier="identifier"
    />
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
  </div>
</template>

<script>
  import MediaImage from '../../components/record/MediaImage';
  import VideoPlayer from '../../components/media/VideoPlayer';
  import MediaPlayer from '../../components/media/MediaPlayer';
  import AudioPlayer from '../../components/media/AudioPlayer';
  import HTMLEmbed from '../../components/generic/HTMLEmbed';

  import oEmbed from '../../plugins/oembed.js';
  import { isPDF, isPlayableMedia, isHTMLVideo, isHTMLAudio, isOEmbed, isRichMedia } from '../../plugins/media.js';

  export default {
    components: {
      MediaImage,
      VideoPlayer,
      AudioPlayer,
      MediaPlayer,
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
      identifier: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        oEmbedData: {}
      };
    },
    computed: {
      displayImage() {
        return (this.imageSrc !== '') && !isRichMedia(this.mimeType, this.codecName, this.url);
      },
      isPDF() {
        return isPDF(this.mimeType);
      },
      isPlayableMedia() {
        return isPlayableMedia(this.mimeType);
      },
      isHTMLVideo() {
        return isHTMLVideo(this.mimeType, this.codecName);
      },
      isHTMLAudio() {
        return isHTMLAudio(this.mimeType);
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
