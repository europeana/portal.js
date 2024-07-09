<template>
  <b-container
    fluid
    class="image-wrapper"
  >
    <b-jumbotron
      fluid
      text-variant="white"
      class="mt-0"
      :class="hero ? 'hero' : ''"
    >
      <ImageWithAttribution
        :src="src"
        :width="width"
        :height="height"
        :alt="alt"
        :content-type="contentType"
        :attribution="attribution"
      />
    </b-jumbotron>
  </b-container>
</template>

<script>
  import ImageWithAttribution from './ImageWithAttribution';

  export default {
    name: 'ImageWithAttributionContainer',

    components: {
      ImageWithAttribution
    },

    props: {
      src: {
        type: String,
        required: true,
        default: null
      },
      width: {
        type: Number,
        default: 550
      },
      height: {
        type: Number,
        default: 790
      },
      alt: {
        type: String,
        default: ''
      },
      contentType: {
        type: String,
        default: null
      },
      attribution: {
        type: Object,
        required: true
      },
      hero: {
        type: Boolean,
        default: false
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .image-wrapper {
    padding: 0;
  }

  .jumbotron {
    height: auto;
    background: $white;

    @media (min-width: $bp-medium) {
      margin-left: -1rem;
      margin-right: -1rem;
    }

    @media (min-width: $bp-large) {
      margin-left: -3rem;
      margin-right: -3rem;
    }

    &::before {
      display: none;
    }

    &.hero {
      min-height: initial;

      ::v-deep figure {
        height: 0;
        padding-top: 56.25%;
        position: relative;
        margin: 0;
        display: flex;
        justify-content: center;
        width: 100%;

        img {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          object-fit: cover;
          width: 100%;
        }
      }
    }

    .container {
      max-width: none;
      justify-content: center;
      align-items: center;
    }
  }
</style>
