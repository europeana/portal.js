<template>
  <iframe
    v-if="isIIIFImage || isIIIFPresentation"
    data-qa="IIIF viewer"
    allowfullscreen="true"
    class="iiif-iframe"
    :src="$path({ name: 'iiif', query: { uri: iiifManifest, query: $nuxt.context.from ? $nuxt.context.from.query.query : '' } })"
    :aria-label="$t('actions.viewDocument')"
    :title="$t('record.IIIFViewer')"
  />
  <MediaCardImage
    v-else-if="displayImage"
    :europeana-identifier="europeanaIdentifier"
    :edm-type="edmType"
    :media="media"
    :lazy="lazy"
    :offset="offset"
  />
  <div
    v-else-if="isSinglePlayableMedia"
    ref="player"
    class="media-player-wrapper col-lg-10 col-12"
  >
    <iframe
      data-qa="media player"
      allowfullscreen="true"
      :src="$path({ name: 'media', query: { id: europeanaIdentifier, mediaUrl: media.about, mediaType: media.ebucoreHasMimeType } })"
      class="media-player"
      :title="$t('record.mediaPlayer')"
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
  <div
    v-else-if="isHTMLAudio"
    class="audio-slide"
  >
    <AudioPlayer
      :europeana-identifier="europeanaIdentifier"
      :src="media.about"
      :type="media.ebucoreHasMimeType"
    />
  </div>
  <EmbedOEmbed
    v-else-if="isOEmbed"
    :url="media.about"
  />
</template>

<script>
  import {
    iiifManifest,
    isHTMLAudio,
    isHTMLVideo,
    isIIIFImage,
    isIIIFPresentation, isOEmbed,
    isPlayableMedia,
    isRichMedia
  } from '@/plugins/media';

  export default {
    name: 'MediaCard',
    components: {
      MediaCardImage: () => import('../item/MediaCardImage'),
      EmbedOEmbed: () => import('../embed/EmbedOEmbed'),
      VideoPlayer: () => import('../media/VideoPlayer'),
      AudioPlayer: () => import('../media/AudioPlayer')
    },
    props: {
      media: {
        type: Object,
        default: null
      },
      europeanaIdentifier: {
        type: String,
        default: ''
      },
      edmType: {
        type: String,
        default: null
      },
      isSinglePlayableMedia: {
        type: Boolean,
        default: false
      },
      lazy: {
        type: Boolean,
        default: true
      },
      offset: {
        type: Number,
        default: null
      }
    },

    data() {
      return {
        oEmbedData: null
      };
    },

    computed: {
      displayImage() {
        return !isRichMedia(this.media);
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
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  // TODO: move the code below to video component when we switch to new item page
  ::v-deep video {
    height: 80vh;
    max-height: 25rem;
    max-width: 100%;
    width: auto;

    @media (min-width: $bp-medium) {
      max-height: 35.5rem;
    }
  }
</style>
