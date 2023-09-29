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
    @media (min-width: $bp-wqhd) {
      width: fit-content;
    }

    ::v-deep .card {
      // max container width is 100% minus max-card-width minus container padding and scrollbar
      $max-xxxl-container-width: calc(100vw - 50px - $max-card-width);

      @media (min-width: ($bp-wqhd)) {
        flex: 0 0 calc(#{$max-xxxl-container-width} / 6 - #{$grid-gutter * 2});
        max-width: calc(#{$max-xxxl-container-width} / 6 - #{$grid-gutter * 2})
      }

      @media (min-width: $bp-4k) {
        flex: 0 0 calc(#{$max-xxxl-container-width} / 6 - #{$grid-gutter-4k * 2});
        max-width: calc(#{$max-xxxl-container-width} / 6 - #{$grid-gutter-4k * 2});
      }

      @media (min-width: calc((6 * $max-card-width) + (1.5 * $max-card-width))) {
        flex: 0 0 calc(#{$max-card-width} - #{$grid-gutter-4k});
        max-width: calc(#{$max-card-width} - #{$grid-gutter-4k});
      }
    }
  }
</style>
