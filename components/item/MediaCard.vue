<template>
  <MediaCardImage
    v-if="displayImage"
    :europeana-identifier="europeanaIdentifier"
    :media="media"
  />
  <div
    v-else-if="isSinglePlayableMedia"
    ref="player"
    class="media-player-wrapper"
  >
    <iframe
      data-qa="media player"
      allowfullscreen="true"
      :src="$path({ name: 'media', query: { id: europeanaIdentifier, mediaUrl: media.about, mediaType: media.ebucoreHasMimeType } })"
      class="media-player"
    />
  </div>
  <div
    v-else-if="isPlayableMedia && !isSinglePlayableMedia"
    :class="{ 'audio-slide': isHTMLAudio }"
  >
    <VideoPlayer
      v-if="isHTMLVideo"
      :europeana-identifier="europeanaIdentifier"
      :src="media.about"
      :type="media.ebucoreHasMimeType"
      :width="media.ebucoreWidth"
      :height="media.ebucoreHeight"
    />
    <AudioPlayer
      v-else-if="isHTMLAudio"
      :europeana-identifier="europeanaIdentifier"
      :src="media.about"
      :type="media.ebucoreHasMimeType"
    />
    <MediaCardImage
      v-else-if="media.thumbnails"
      :europeana-identifier="europeanaIdentifier"
      :media="media"
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
    class="iiif-iframe"
    :src="$path({ name: 'iiif', query: { uri: iiifManifest } })"
    :aria-label="$t('actions.viewDocument')"
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
  } from '../../plugins/media';
  import HTMLEmbed from '../generic/HTMLEmbed';
  import VideoPlayer from '../../components/media/VideoPlayer';
  import AudioPlayer from '../../components/media/AudioPlayer';
  import oEmbed from '../../plugins/oembed';

  export default {
    name: 'MediaCard',
    components: {
      MediaCardImage: () => import('../../components/item/MediaCardImage'),
      HTMLEmbed,
      VideoPlayer,
      AudioPlayer
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
      isSinglePlayableMedia: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        oEmbedData: {}
      };
    },

    computed: {
      displayImage() {
        return (this.media.thumbnails !== '') && !isRichMedia(this.media);
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

    created() {
      if (this.isOEmbed) {
        oEmbed(this.media.about).then((response) => {
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
