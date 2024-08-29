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
      MediaVideoPlayer: () => import('../media/MediaVideoPlayer'),
      MediaAudioPlayer: () => import('../media/MediaAudioPlayer')
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
