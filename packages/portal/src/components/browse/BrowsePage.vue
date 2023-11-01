<template>
  <div
    data-qa="browse page"
    class="page white-page xxl-page"
  >
    <slot />
    <b-container>
      <ContentHeader
        :title="name"
        :description="headline"
        :media-url="socialMediaImageUrl"
        button-variant="secondary"
        class="half-col"
      />
      <BrowseSections
        :sections="hasPartCollection.items"
      />
    </b-container>
  </div>
</template>

<script>
  import ContentHeader from '../content/ContentHeader';
  import BrowseSections from './BrowseSections';

  export default {
    components: {
      ContentHeader,
      BrowseSections
    },
    props: {
      name: {
        type: String,
        default: null
      },
      headline: {
        type: String,
        default: null
      },
      hasPartCollection: {
        type: Object,
        default: null
      },
      socialMediaImageUrl: {
        type: String,
        default: null
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .page {
    padding-bottom: 1rem;
    padding-top: 1rem;
    margin-top: -1rem;

    @media (min-width: $bp-4k) {
      padding-bottom: 1.5rem;
      padding-top: 1.5rem;
      margin-top: -1.5rem;
    }
  }

  .container {
    $max-xxxl-container-width: 102.5rem; // fixed xxxl width to preserve card aspect ratio

    @media (min-width: $bp-xxxl) {

      max-width: $max-xxxl-container-width;
    }

    @media (min-width: $bp-4k) {
      // 4k uses dynamic text sizing & larger gutters, so size needs to be larger to keep 4 cards
      max-width: calc(#{$max-xxxl-container-width} + #{$grid-gutter * 4});
    }

    ::v-deep .card {
      @media (min-width: ($bp-xxxl)) {
      flex: 0 0 calc(#{$max-xxxl-container-width} / 4 - #{$grid-gutter * 2});
      max-width: calc(#{$max-xxxl-container-width} / 4 - #{$grid-gutter * 2});
      }
    }
  }
</style>
