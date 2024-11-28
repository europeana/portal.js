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
      :src="localePath({ name: 'media', query: { id: europeanaIdentifier, mediaUrl: media.about, mediaType: media.ebucoreHasMimeType } })"
      class="media-player"
      :title="$t('record.mediaPlayer')"
    />
  </div>
  <MediaVideoPlayer
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
    <MediaAudioPlayer
      :europeana-identifier="europeanaIdentifier"
      :src="media.about"
      :type="media.ebucoreHasMimeType"
    />
  </div>
  <EmbedOEmbed
    v-else-if="media.isOEmbed"
    :url="media.about"
  />
</template>

<script>
  import WebResource from '@/plugins/europeana/edm/WebResource';

  export default {
    name: 'MediaCard',
    components: {
      MediaCardImage: () => import('./MediaCardImage'),
      EmbedOEmbed: () => import('../embed/EmbedOEmbed'),
      MediaVideoPlayer: () => import('./MediaVideoPlayer'),
      MediaAudioPlayer: () => import('./MediaAudioPlayer')
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
  .media-player-wrapper {
    position: relative;
    height: 100%;
    margin: 0 auto;
    overflow: hidden;
    min-width: 19rem;

    iframe {
      border: 0;
      border-radius: 0;
      box-shadow: none;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      width: 100%;
      height: 100%;
    }
  }
</style>
