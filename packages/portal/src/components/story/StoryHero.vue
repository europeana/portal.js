<template>
  <div class="story-hero d-flex flex-column xxl-page">
    <div
      class="hero-background"
    >
      <ImageWithAttribution
        id="hero-background-image"
        ref="heroBackground"
        :alt="heroImageAltText"
        :src="heroImage.image.url"
        :content-type="heroImage.image.contentType"
        :attribution="heroImage"
        :contentful-image-crop-presets="FULL_VIEWPORT_PRESETS"
        :picture-source-media-resolutions="[1, 2, 3]"
        :lazy="false"
        width="auto"
        height="auto"
        :max-width="null"
      />
    </div>
    <div
      class="hero-content"
    >
      <b-container class="hero-content-container">
        <header class="row">
          <b-col
            cols="12"
            lg="6"
            class="col lead mt-3 mb-0"
          >
            <div
              v-if="contextLabel"
              class="context-label d-inline-block px-2 py-1 mb-3"
            >
              {{ contextLabel }}
            </div>
            <h1 class="title">
              {{ title }}
            </h1>
            <p
              v-if="subtitle"
              class="subtitle"
            >
              {{ subtitle }}
            </p>
          </b-col>
        </header>
      </b-container>
    </div>
  </div>
</template>

<script>
  import parseMarkdownHtmlMixin from '@/mixins/parseMarkdownHtml';
  import ImageWithAttribution from '@/components/image/ImageWithAttribution';
  import { FULL_VIEWPORT_PRESETS } from '@/utils/contentful/imageCropPresets';

  export default {
    name: 'StoryHero',

    components: {
      ImageWithAttribution
    },

    mixins: [parseMarkdownHtmlMixin],

    props: {
      title: {
        type: String,
        required: true
      },

      subtitle: {
        type: String,
        default: null
      },

      heroImage: {
        type: Object,
        required: true
      },

      contextLabel: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        FULL_VIEWPORT_PRESETS,
        heroImageAltText: this.heroImage.image?.description || ''
      };
    },

    mounted() {
      window.addEventListener('scroll', this.parallaxBackground);
    },

    beforeDestroy() {
      window.removeEventListener('scroll', this.parallaxBackground);
    },

    methods: {
      parallaxBackground() {
        const heroBackgroundImageElement = document.querySelector('#hero-background-image img');
        const heroBackgroundHeight = heroBackgroundImageElement?.clientHeight || 1;
        const distanceHeroToViewportTop = heroBackgroundImageElement?.getBoundingClientRect().top;

        if (heroBackgroundImageElement && distanceHeroToViewportTop < 0) {
          const translate = (-distanceHeroToViewportTop / heroBackgroundHeight) * 75;
          heroBackgroundImageElement.style.transform = `translateY(${translate}%)`;
        }

        if (heroBackgroundImageElement && distanceHeroToViewportTop > 0) {
          heroBackgroundImageElement.style.transform = '';
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/responsive-background-image';

  .story-hero {
    margin-top: -70px;
    background-color: $mediumgrey-light;
    min-height: 100vh;
    position: relative;
    overflow: hidden;

    @media (min-width: $bp-4k) {
      margin-top: calc(1.5 * -70px);
    }
  }

  .hero-content {
    position: relative; // Prevents blending with the background
    padding-top: 5rem;
    margin-top: auto;
    z-index: 2;
  }

  .hero-content-container {
    padding-bottom: 3.5rem;
    color: $white;

    @media (min-width: $bp-medium) {
      padding-bottom: 5.5rem;
    }

    ::v-deep .title h1,
    .subtitle,
    .context-label {
      color: $white;
    }

    .title {
      @extend %title-1;
    }

    .subtitle {
      font-family: $font-family-sans-serif;
      font-size: $font-size-large;
      font-weight: 600;
      display: block;
      font-style: normal;
      margin: 0.5rem 0 0;

      @media (min-width: $bp-4k) {
        font-size: calc(1.5 * $font-size-large);
        margin: 0.75rem 0 0;
      }
    }

    .context-label {
      background-color: $blue;
      border-radius: $border-radius-small;

      @media (min-width: $bp-4k) {
        border-radius: $border-radius-large;
        padding: 0.5rem 1rem !important;
        margin-bottom: 1.5rem !important;
      }
    }
  }

  .hero-background {
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    z-index: 1;

    &::before {
      content: '';
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background-image: linear-gradient(0deg, #000, #000);
      mix-blend-mode: saturation;
      position: absolute;
      z-index: 1;
    }

    &::after {
      content: '';
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6));
      position: absolute;
      z-index: 1;
    }

    ::v-deep figure {
      position: static;
      height: 100%;
      width: 100%;

      img {
        height: 100%
      }
    }
  }

  ::v-deep .icon-info {
    bottom: 15px;
    left: 15px;
    right: auto;
    z-index: 3;

    @media (min-width: $bp-medium) {
      bottom: 1.5rem;
      left: 1.5rem;
    }
  }

  ::v-deep cite {
    bottom: 0.5rem;
    left: 0.5rem;
    right: auto !important;
    z-index: 3;
  }
</style>

<docs lang="md">
  ```jsx
  <div style="overflow: hidden">
    <StoryHero
      title="Story title"
      subtitle="Story subtitle with a bit more text."
      context-label="Story"
      :hero-image="imagesWithAttribution[0]"
    />
    </div>
  ```
</docs>
