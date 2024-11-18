<template>
  <!-- eslint-disable vue/no-v-html -->
  <div
    v-if="responsive && height && width"
    ref="responsiveWrapper"
    class="responsive-embed-wrapper"
    :style="`width:${widthWrapper}px`"
    data-qa="responsive embed wrapper"
  >
    <div
      ref="embedContainer"
      data-qa="html embed"
      class="html-embed"
      :style="`padding-bottom:${heightAsPercentOfWidth}%`"
      v-html="html"
    />
  </div>
  <div
    v-else
    ref="embedContainer"
    data-qa="html embed"
    class="html-embed"
    v-html="html"
  />
  <!-- eslint-enable vue/no-v-html -->
</template>

<script>
  export default {
    name: 'EmbedHTML',

    props: {
      html: {
        type: String,
        required: true
      },
      height: {
        type: [Number, String],
        default: null
      },
      width: {
        type: [Number, String],
        default: null
      },
      title: {
        type: String,
        default: null
      },
      responsive: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        widthWrapper: 0
      };
    },

    computed: {
      heightAsPercentOfWidth() {
        return (this.height * 100) / this.width;
      }
    },

    mounted() {
      this.setWidthWrapper();
      window.addEventListener('resize', this.setWidthWrapper);

      if (this.title) {
        const iframe = this.$refs.embedContainer.getElementsByTagName('iframe')?.[0];
        iframe?.setAttribute('title', this.title);
      }
    },

    methods: {
      setWidthWrapper() {
        if (this.$refs.responsiveWrapper) {
          const wrapperHeight = this.$refs.responsiveWrapper.clientHeight;
          this.widthWrapper = (this.width * wrapperHeight) / this.height;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/mixins';

  .html-embed {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    ::v-deep iframe {
      display: inline;
      margin-right: auto;
      margin-left: auto;
      border: 0;
      box-shadow: none;
    }

    ::v-deep .sketchfab-embed-wrapper {
      width: 100%;

      iframe {
        width: 100%;
        @include media-viewer-height;
      }
    }
  }

  .responsive-embed-wrapper {
    @include media-viewer-height;
    margin: 0 auto;
    width: 100%;
    max-width: 100%;

    .html-embed {
      display: block;
      position: relative;
      height: 0;
      overflow: hidden;

      ::v-deep iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
