<template>
  <div
    class="hero figure-attribution responsive-backround-image responsive-font"
    :style="imageCSSVars"
  >
    <div
      class="hero-content"
    >
      <header>
        <i18n
          path="homePage.title"
          tag="h1"
          class="text-center"
        >
          <template #digital>
            <span class="digital-highlight">
              {{ $t('homePage.titleDigital') }}
            </span>
          </template>
        </i18n>
        <p
          class="sub-headline text-center"
        >
          {{ $t('homePage.subHeadline') }}
        </p>
      </header>
      <SearchForm />
    </div>
    <AttributionToggle
      :attribution="backgroundImage"
    />
    <EULogo class="bottom-right" />
  </div>
</template>

<script>
  import SearchForm from '@/components/search/SearchForm';
  import AttributionToggle from '@/components/generic/AttributionToggle';
  import EULogo from '@/components/funders/EULogo';
  import { responsiveBackgroundImageCSSVars } from '@/plugins/contentful-utils';

  export default {
    name: 'HomeHero',

    components: {
      SearchForm,
      AttributionToggle,
      EULogo
    },

    props: {
      backgroundImage: {
        type: Object,
        default: null
      }
    },

    computed: {
      imageCSSVars() {
        return this.backgroundImage?.image &&
          responsiveBackgroundImageCSSVars(this.backgroundImage.image,
                                           { small: { w: 576, h: 896, fit: 'fill' },
                                             medium: { w: 768, h: 1080, fit: 'fill' },
                                             large: { w: 992, h: 1080, fit: 'fill' },
                                             xl: { w: 1200, h: 1080, fit: 'fill' },
                                             xxl: { w: 1440, h: 1080, fit: 'fill' },
                                             xxxl: { w: 1920, h: 1080, fit: 'fill' },
                                             wqhd: { w: 2560, h: 1440, fit: 'fill' },
                                             '4k': { w: 3840, h: 2160, fit: 'fill' } });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  .hero {
    margin-top: -70px;
    margin-bottom: 4.5rem;
    background-color: $mediumgrey-light;
    padding: 9.5rem 1.5rem;
    min-height: 100vh;
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;

    @media (min-width: $bp-xxxl) {
      margin-top: -4.375vw;
    }

    &::before {
      content: '';
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background-image: linear-gradient(0deg, #0b60aa, #0b60aa);
      mix-blend-mode: multiply;
      position: absolute;
    }

    &::after {
      border-bottom: 209px solid $white;
      border-left: 95px solid transparent;
      content: '';
      display: block;
      height: 0;
      position: absolute;
      right: 0;
      top: calc(100% - 209px);
      width: 0;
      z-index: 1;

      @media (min-width: $bp-xxxl) {
        border-bottom-width: calc(209 / 16 * 1vw); // divide by 16 (1rem = 16px) and use vw to create responsive value
        border-left-width: calc(95 / 16 * 1vw); // divide by 16 (1rem = 16px) and use vw to create responsive value
        top: calc(100% - (209 / 16 * 1vw) + 1px); // Adding one pixel so as to prevent a black line due to rounding
      }
    }

    h1,
    .sub-headline {
      color: $white;
    }

    h1 {
      font-size: 2.125rem;
      font-weight: 900;
      margin-bottom: 1em;

      .digital-highlight {
        text-shadow: 3.5px 3.5px 0 $blue;
      }

      @media (min-width: $bp-medium) {
        font-size: 2.875rem;
      }
    }

    .sub-headline {
      font-size: 1rem;
      margin-bottom: 4em;

      @media (min-width: $bp-medium) {
        font-size: 1.625rem;
      }
    }

    @media (min-width: $bp-xxxl) {
      padding: 6em 0 5em;
      font-size: 2vw;

      h1 {
        font-size: 2.6vw;

        .digital-highlight {
          text-shadow: 0.24vw 0.24vw 0 $blue;
        }
      }

      .sub-headline {
        font-size: 1.5vw;
      }
    }

    @media (min-width: $bp-medium) {
      h1,
      .sub-headline,
      .open:not(.top-search) {
        width: 25em;
        min-width: 644px;
        margin-left: auto;
        margin-right: auto;
      }

      h1 {
        width: auto;
        max-width: 744px;
      }
    }

    @media (min-width: $bp-large) {
      h1 {
        max-width: 80%;
      }
    }
  }

  .hero-content {
    margin: 0 auto;
    position: relative; // Prevents blending with the background
  }

  ::v-deep .icon-info {
    left: 1.5rem;
    right: auto;
    z-index: 3;
  }

  ::v-deep cite {
    left: 0.5rem;
    right: auto;
    z-index: 3;
  }
</style>

<docs lang="md">
  ```jsx
    <HomeHero
      :background-image="{
        creator: 'Europeana Foundation',
        license: 'https://creativecommons.org/publicdomain/zero/1.0',
        name: 'Background homepage',
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
