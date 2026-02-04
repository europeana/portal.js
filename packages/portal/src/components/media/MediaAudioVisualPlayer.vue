<template>
  <div
    class="media-player-wrapper col-lg-10 col-12"
  >
    <iframe
      data-qa="media player"
      allowfullscreen="true"
      :src="localePath({ name: 'media', query: { id: itemId, mediaUrl: url, mediaType: format } })"
      class="media-player"
      :title="$t('record.mediaPlayer')"
    />
  </div>
</template>

<script>
  export default {
    name: 'MediaAudioVisualPlayer',

    props: {
      format: {
        type: String,
        default: null
      },

      itemId: {
        type: String,
        default: null
      },

      url: {
        type: String,
        required: true
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
