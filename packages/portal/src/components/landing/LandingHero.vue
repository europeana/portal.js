<template>
  <div class="d-flex">
    <header>
      <!-- eslint-disable vue/no-v-html -->
      <h1
        v-html="highlightedEuropeanaTitle"
      />
      <!-- eslint-enable vue/no-v-html -->
      <p>
        {{ headline }}
      </p>
      <b-button
        variant="primary"
        :href="cta.url"
      >
        {{ cta.text }}
      </b-button>
    </header>
    <div
      class="hero-image responsive-backround-image"
      :style="imageCSSVars"
    >
      <AttributionToggle
        :attribution="heroImage"
      />
    </div>
  </div>
</template>

<script>
  import AttributionToggle from '@/components/generic/AttributionToggle';

  export default {
    name: 'LandingHero',

    components: {
      AttributionToggle
    },

    props: {
      title: {
        type: String,
        required: true
      },
      headline: {
        type: String,
        default: null
      },
      cta: {
        type: Object,
        default: null
      },
      heroImage: {
        type: Object,
        default: null
      }
    },

    computed: {
      imageCSSVars() {
        return this.heroImage?.image &&
          this.$contentful.assets.responsiveBackgroundImageCSSVars(
            this.heroImage.image,
            {
              small: { w: 576, h: 407, fit: 'fill' },
              medium: { w: 768, h: 542, fit: 'fill' },
              large: { w: 591, h: 353, fit: 'fill' },
              xl: { w: 695, h: 415, fit: 'fill' },
              xxl: { w: 815, h: 487, fit: 'fill' },
              xxxl: { w: 1074, h: 600, fit: 'fill' },
              wqhd: { w: 1432, h: 800, fit: 'fill' },
              '4k': { w: 2148, h: 1300, fit: 'fill' }
            }
          );
      },
      highlightedEuropeanaTitle() {
        return this.title.replace('{{', '<span class="title-highlight">').replace('}}', '</span>');
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/responsive-background-image';

  .hero-image {
    width: 50%;
    position: relative;
  }

  ::v-deep .title-highlight {
    color: $blue;
  }
</style>

<docs lang="md">
  ```jsx
    <LandingHero
      title="This is a {{landing}} page"
      headline="A description what this page is all about"
      :cta="{
        url: 'https://www.europeana.eu',
        text: 'Ga naar Europeana'
      }"
      :hero-image="{
        creator: 'Europeana Foundation',
        license: 'https://creativecommons.org/publicdomain/zero/1.0',
        name: 'Image landing page',
        provider: null,
        url: null,
        image: {
          contentType: 'image/jpeg',
          description: null,
          height: 2694,
          url: 'https://images.ctfassets.net/i01duvb6kq77/1trzaYGwJsR79hW38lMpJO/465bdac6bb52df2f574c50dacdc74ef8/slantedimagecover_v1.jpg',
          width: 4320
        }
      }"
    />
  ```
</docs>
