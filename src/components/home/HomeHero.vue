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

    data() {
      return {
        backgroundImage: null
      };
    },

    async fetch() {
      const backgroundAssetId = { id: this.$config.app.homePageBackgroundAssetId };
      const assetResponse = await this.$contentful.query('homeBackground', backgroundAssetId);
      this.backgroundImage = assetResponse.data.data.asset;
    },

    computed: {
      imageCSSVars() {
        if (this.backgroundImage) {
          return {
            '--bg-img-small': `url('${optimisedSrcForContentfulAsset(this.backgroundImage, { w: 576, fit: 'fill' })}')`,
            '--bg-img-medium': `url('${optimisedSrcForContentfulAsset(this.backgroundImage, { w: 768, fit: 'fill' })}')`,
            '--bg-img-large': `url('${optimisedSrcForContentfulAsset(this.backgroundImage, { w: 992, fit: 'fill' })}')`,
            '--bg-img-xl': `url('${optimisedSrcForContentfulAsset(this.backgroundImage, { w: 1200, fit: 'fill' })}')`,
            '--bg-img-xxl': `url('${optimisedSrcForContentfulAsset(this.backgroundImage, { w: 1440, fit: 'fill' })}')`,
            '--bg-img-xxxl': `url('${optimisedSrcForContentfulAsset(this.backgroundImage, { w: 1920, fit: 'fill' })}')`,
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
    --overlay: linear-gradient(0deg, rgba(0 0 0 / 60%), rgba(0 0 0 / 60%));

    @media (max-width: $bp-small) {
      background-image: var(--overlay), var(--bg-img-small);
    }

    @media (min-width: $bp-small) and (max-width: $bp-medium) {
      background-image: var(--overlay), var(--bg-img-medium, var(--bg-img-small));
    }

    @media (min-width: $bp-medium) and (max-width: $bp-large) {
      background-image: var(--overlay), var(--bg-img-large, var(--bg-img-small));
    }

    @media (min-width: $bp-large) and (max-width: $bp-extralarge) {
      background-image: var(--overlay), var(--bg-img-xl, var(--bg-img-small));
    }

    @media (min-width: $bp-extralarge) and (max-width: $bp-xxl) {
      background-image: var(--overlay), var(--bg-img-xxl, var(--bg-img-small));
    }

    @media (min-width: $bp-xxl) and (max-width: $bp-xxxl) {
      background-image: var(--overlay), var(--bg-img-xxxl, var(--bg-img-small));
    }

    @media (min-width: $bp-xxxl) and (max-width: $bp-wqhd) {
      background-image: var(--overlay), var(--bg-img-wqhd, var(--bg-img-small));
    }

    @media (min-width: $bp-wqhd + 1px) {
      background-image: var(--overlay), var(--bg-img-4k, var(--bg-img-small));
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
