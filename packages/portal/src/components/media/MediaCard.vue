<template>
  <MediaCardImage
    v-if="!media.isRichMedia"
    :europeana-identifier="europeanaIdentifier"
    :edm-type="edmType"
    :media="media"
    :lazy="lazy"
    :offset="offset"
  />
  <MediaAudioVisualPlayer
    v-else-if="isSinglePlayableMedia"
    :item-id="europeanaIdentifier"
    :url="media.about"
    :format="media.ebucoreHasMimeType"
  />
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
      MediaAudioVisualPlayer: () => import('./MediaAudioVisualPlayer'),
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
