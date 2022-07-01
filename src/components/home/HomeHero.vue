<template>
  <div
    class="hero"
    :style="imageCSSVars"
  >
    <div
      class="hero-content"
    >
      <header>
        <h1
          class="text-center"
        >
          {{ $t('homePage.title') }}
        </h1>
        <i18n
          path="homePage.subHeadline"
          tag="p"
          for="homePage.free"
          class="sub-headline text-center"
        >
          <template #download>
            <strong>{{ $t('homePage.download') }}</strong>
          </template>
          <template #free>
            <strong>{{ $t('homePage.free') }}</strong>
          </template>
        </i18n>
      </header>
      <SearchForm />
    </div>
  </div>
</template>

<script>
  import SearchForm from '@/components/search/SearchForm';
  import { optimisedSrcForContentfulAsset } from '@/plugins/contentful-utils';

  export default {
    name: 'HomeHero',

    components: {
      SearchForm
    },

    props: {
      backgroundImage: {
        type: Object,
        default: null
      }
    },

    computed: {
      imageCSSVars() {
        if (this.backgroundImage) {
          return {
            '--bg-img-small': `url('${optimisedSrcForContentfulAsset(this.backgroundImage, { w: 576, h: 896, fit: 'fill' })}')`,
            '--bg-img-medium': `url('${optimisedSrcForContentfulAsset(this.backgroundImage, { w: 768, h: 1080, fit: 'fill' })}')`,
            '--bg-img-large': `url('${optimisedSrcForContentfulAsset(this.backgroundImage, { w: 992, h: 1080, fit: 'fill' })}')`,
            '--bg-img-xl': `url('${optimisedSrcForContentfulAsset(this.backgroundImage, { w: 1200, h: 1080, fit: 'fill' })}')`,
            '--bg-img-xxl': `url('${optimisedSrcForContentfulAsset(this.backgroundImage, { w: 1440, h: 1080, fit: 'fill' })}')`,
            '--bg-img-xxxl': `url('${optimisedSrcForContentfulAsset(this.backgroundImage, { w: 1920, h: 1080, fit: 'fill' })}')`,
            '--bg-img-wqhd': `url('${optimisedSrcForContentfulAsset(this.backgroundImage, { w: 2560, h: 1440, fit: 'fill' })}')`,
            '--bg-img-4k': `url('${optimisedSrcForContentfulAsset(this.backgroundImage, { w: 3840, h: 2160, fit: 'fill' })}')`
          };
        } else {
          return null;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  .hero {
    margin-top: -70px;
    margin-bottom: 1rem;
    background-color: $mediumgrey-light;
    padding: 12rem 1.5rem;
    min-height: 100vh;
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;

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
      border-bottom: 145px solid $white;
      border-left: 60px solid transparent;
      content: '';
      display: block;
      height: 0;
      position: absolute;
      right: 0;
      top: calc(100% - 145px);
      width: 0;
      z-index: 1;
    }

    @media (max-width: $bp-small) {
      background-image: var(--bg-img-small);
    }

    @media (min-width: $bp-small) and (max-width: $bp-medium) {
      background-image: var(--bg-img-medium, var(--bg-img-small));
    }

    @media (min-width: $bp-medium) and (max-width: $bp-large) {
      background-image: var(--bg-img-large, var(--bg-img-small));
    }

    @media (min-width: $bp-large) and (max-width: $bp-extralarge) {
      background-image: var(--bg-img-xl, var(--bg-img-small));
    }

    @media (min-width: $bp-extralarge) and (max-width: $bp-xxl) {
      background-image: var(--bg-img-xxl, var(--bg-img-small));
    }

    @media (min-width: $bp-xxl) and (max-width: $bp-xxxl) {
      background-image: var(--bg-img-xxxl, var(--bg-img-small));
    }

    @media (min-width: $bp-xxxl) and (max-width: $bp-wqhd) {
      background-image: var(--bg-img-wqhd, var(--bg-img-small));
    }

    @media (min-width: $bp-wqhd + 1px) {
      background-image: var(--bg-img-4k, var(--bg-img-small));
    }

    h1,
    .sub-headline {
      color: $white;
    }

    h1 {
      font-size: 2.125rem;
      font-weight: 700;
      margin-bottom: 2em;
    }

    .sub-headline {
      font-size: 1rem;
      margin-bottom: 4em;
    }

    @media (min-width: $bp-medium) {
      .sub-headline {
        font-size: 1.25rem;
      }
    }

    @media (min-width: $bp-xxxl) {
      padding: 6em 0 3em;
      font-size: 2vw;

      h1 {
        font-size: 2.6vw;
      }

      .sub-headline {
        font-size: 1.5vw;
      }
    }
  }

  .hero-content {
    margin: 0 auto;
    position: relative; // Prevents blending with the background

    @media (min-width: $bp-medium) {
      width: 25em;
      min-width: 644px;
    }
  }

</style>

<docs lang="md">
  ```jsx
    <HomeHero />
  ```
</docs>
