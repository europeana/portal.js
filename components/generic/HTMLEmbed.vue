<template>
  <!-- eslint-disable vue/no-v-html -->
  <div
    v-if="html && responsiveProvider"
    class="responsive-embed-wrapper"
    :style="`max-width:${maxWidthWrapper}rem`"
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

    computed: {
      responsiveProvider() {
        const responsive = ['YouTube', 'Vimeo'];
        return responsive.includes(this.provider);
      },
      heightAsPercentOfWidth() {
        return (this.height * 100) / this.width;
      },
      maxWidthWrapper() {
        const wrapperHeight = window.innerWidth <= 768 ? 22.5 : 35.5;
        return (this.width * wrapperHeight) / this.height;
      }
    }
  };
</script>
