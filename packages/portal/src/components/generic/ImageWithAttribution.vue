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
      @click="!citeCollapsed ? toggleCite : null"
    >
      <figure>
        <OptimisedImage
          v-if="src"
          :src="src"
          :width="width"
          :height="height"
          :alt="alt"
          :content-type="contentType"
          :max-width="1100"
          data-qa="image"
        />
        <AttributionToggle
          :attribution="attribution"
        />
      </figure>
    </b-jumbotron>
  </b-container>
</template>

<script>
  import AttributionToggle from '@/components/generic/AttributionToggle';
  import OptimisedImage from './OptimisedImage';

  export default {
    name: 'ImageWithAttribution',

    components: {
      AttributionToggle,
      OptimisedImage
    },

    props: {
      header: {
        type: String,
        default: ''
      },
      lead: {
        type: String,
        default: ''
      },
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
      name: {
        type: String,
        default: null
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
  @import '@/assets/scss/variables';

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

    figure {
      margin: 0;
    }

    &.hero {
      min-height: initial;

      figure {
        height: 0;
        padding-top: 56.25%;
        position: relative;
        width: 100%;
        display: flex;
        justify-content: center;

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
