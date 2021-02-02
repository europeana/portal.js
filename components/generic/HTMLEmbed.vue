<template>
  <!-- eslint-disable vue/no-v-html -->
  <div
    v-if="html && provider === 'YouTube'"
    class="youtube-embed-wrapper"
    :style="maxWidthWrapper"
  >
    <div
      data-qa="html embed"
      class="mb-5 html-embed youtube-embed"
      :style="aspectRatio"
      v-html="html"
    />
  </div>
  <div
    v-else-if="html && !provider !== 'YouTube'"
    data-qa="html embed"
    class="mb-5 html-embed"
    v-html="html"
  />
  <AlertMessage
    v-else-if="error"
    :error="error"
  />
  <!-- eslint-enable vue/no-v-html -->
</template>

<script>
  import AlertMessage from '../../components/generic/AlertMessage';

  export default {
    name: 'OEmbedMedia',

    components: {
      AlertMessage
    },

    props: {
      html: {
        type: String,
        default: ''
      },
      provider: {
        type: String,
        default: ''
      },
      height: {
        type: Number,
        default: null
      },
      width: {
        type: Number,
        default: null
      },
      error: {
        type: [String, Error],
        default: ''
      }
    },

    computed: {
      aspectRatio() {
        return `padding-bottom:${(this.height * 100) / this.width}%`;
      },
      maxWidthWrapper() {
        const wrapperHeight = window.innerWidth <= 768 ? 22.5 : 35.5;
        return `max-width:${(this.width * wrapperHeight) / this.height}rem`;
      }
    }
  };
</script>
