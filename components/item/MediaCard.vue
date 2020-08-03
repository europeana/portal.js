<template>
  <div>
    <MediaCardImage
      v-if="displayImage"
      :europeana-identifier="europeanaIdentifier"
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
  // import { isImage } from '../../plugins/media';

  import {
    iiifManifest,
    isHTMLAudio,
    isHTMLVideo,
    isIIIFImage,
    isIIIFPresentation, isOEmbed,
    isPlayableMedia,
    isRichMedia
  } from '../../plugins/media';

  export default {
    props: {
      media: {
        type: Object,
        default: null
      },
      europeanaIdentifier: {
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
      displayImage() {
        return (this.imageSrc !== '') && !isRichMedia(this.media);
      },
      isPlayableMedia() {
        return isPlayableMedia(this.media);
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
  img {
    height: 100%;
  }
</style>
