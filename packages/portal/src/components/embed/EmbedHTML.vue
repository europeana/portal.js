<template>
  <!-- eslint-disable vue/no-v-html -->
  <div
    v-if="responsive && height && width"
    ref="responsiveWrapper"
    class="responsive-embed-wrapper"
    :style="`max-width:${maxWidthWrapper}px`"
    data-qa="responsive embed wrapper"
  >
    <div
      data-qa="html embed"
      class="mb-5 html-embed"
      :style="`padding-bottom:${heightAsPercentOfWidth}%`"
      v-html="html"
    />
  </div>
  <div
    v-else
    data-qa="html embed"
    class="mb-5 html-embed"
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
      responsive: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        maxWidthWrapper: 0
      };
    },

    computed: {
      heightAsPercentOfWidth() {
        return (this.height * 100) / this.width;
      }
    },

    mounted() {
      this.setMaxWidthWrapper();
      window.addEventListener('resize', this.setMaxWidthWrapper);
    },

    methods: {
      setMaxWidthWrapper() {
        if (this.$refs.responsiveWrapper) {
          const wrapperHeight = this.$refs.responsiveWrapper.clientHeight;
          this.maxWidthWrapper = (this.width * wrapperHeight) / this.height;
        }
      }
    }
  };
</script>
