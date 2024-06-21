<template>
  <div
    data-qa="browse page"
    class="page white-page xxl-page"
  >
    <slot />
    <b-container
      :class="layoutClass"
    >
      <ContentHeader
        :title="name"
        :description="headline"
        :media-url="imageUrl"
        button-variant="secondary"
        class="half-col"
      />
      <ContentSection
        v-for="(section, index) in hasPartCollection.items"
        :key="index"
        :section="section"
        :lazy="index > 0"
      />
    </b-container>
  </div>
</template>

<script>
  import ContentHeader from '../content/ContentHeader';
  import ContentSection from '../content/ContentSection';

  export default {
    components: {
      ContentHeader,
      ContentSection
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
      imageUrl: {
        type: String,
        default: null
      }
    },

    computed: {
      layoutClass() {
        const cardGroupSections = this.hasPartCollection?.items.filter(section => section['__typename'] === 'CardGroup');
        const largeCardGroupSections = cardGroupSections.filter(section => section.hasPartCollection?.items.length >= 5);

        if (largeCardGroupSections.length <= 0) {
          return 'browse-page-4-col';
        }
        return null;
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

  .browse-page-4-col {
    @media (min-width: $bp-wqhd) {
      width: fit-content;
      max-width: calc(4 * (#{$max-card-width} + #{$grid-gutter * 2}));
    }

    @media (min-width: $bp-4k) {
      max-width: calc(4 * (#{$max-card-width} + #{$grid-gutter-4k * 2}));
    }
    ::v-deep .card:not(.mosaic-item) {

      @media (min-width: ($bp-wqhd)) {
        flex: 0 0 calc(100% / 4 - #{$grid-gutter * 2});
      }

      @media (min-width: ($bp-4k)) {
        flex: 0 0 calc(100% / 4 - #{$grid-gutter-4k * 2});
      }
    }
  }
</style>
