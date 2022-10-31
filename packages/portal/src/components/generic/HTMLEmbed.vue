<template>
  <!-- eslint-disable vue/no-v-html -->
  <div
    v-if="html && responsiveProvider"
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
    v-else-if="html && !responsiveProvider"
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
    name: 'HTMLEmbed',

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
        type: [Number, String],
        default: null
      },
      width: {
        type: [Number, String],
        default: null
      },
      error: {
        type: [String, Error],
        default: ''
      }
    },

    data() {
      return {
        maxWidthWrapper: 0
      };
    },

    computed: {
      responsiveProvider() {
        const responsive = ['YouTube', 'Vimeo', 'Sketchfab'];
        return responsive.includes(this.provider);
      },
      heightAsPercentOfWidth() {
        return (this.height * 100) / this.width;
      }
    },

    mounted() {
      const interval = setInterval(() => {
        if (this.$refs.responsiveWrapper) {
          this.setMaxWidthWrapper();
          window.addEventListener('resize', this.setMaxWidthWrapper);
          clearInterval(interval);
        }
      }, 100);
    },

    methods: {
      setMaxWidthWrapper() {
        const wrapperHeight = this.$refs.responsiveWrapper.clientHeight;
        this.maxWidthWrapper = (this.width * wrapperHeight) / this.height;
      }
    }
  };
</script>
