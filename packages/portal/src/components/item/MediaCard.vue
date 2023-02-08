<template>
  <MediaCardImage
    v-if="!media.isRichMedia"
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
    v-else-if="media.isHTMLVideo"
    :europeana-identifier="europeanaIdentifier"
    :src="media.about"
    :type="media.ebucoreHasMimeType"
    :width="media.ebucoreWidth"
    :height="media.ebucoreHeight"
  />
  <div
    v-else-if="media.isHTMLAudio"
    class="audio-slide"
  >
    <AudioPlayer
      :europeana-identifier="europeanaIdentifier"
      :src="media.about"
      :type="media.ebucoreHasMimeType"
    />
  </div>
  <EmbedOEmbed
    v-else-if="media.isOEmbed"
    :url="media.about"
  />
  <iframe
    v-else-if="media.isIIIFImage || media.isIIIFPresentation"
    data-qa="IIIF viewer"
    allowfullscreen="true"
    class="iiif-iframe"
    :src="$path({ name: 'iiif', query: { uri: media.iiifManifest, query: $nuxt.context.from ? $nuxt.context.from.query.query : '' } })"
    :aria-label="$t('actions.viewDocument')"
    :title="$t('record.IIIFViewer')"
  />
</template>

<script>
  import WebResource from '@/plugins/europeana/web-resource';

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
        type: WebResource,
        required: true
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
