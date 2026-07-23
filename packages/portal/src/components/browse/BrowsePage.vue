<template>
  <div
    data-qa="browse page"
    class="page xxl-page"
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
    </b-container>
    <template v-for="(section, index) in browseAndScrollifySections">
      <b-container
        v-if="Array.isArray(section)"
        :key="index"
        :class="layoutClass"
      >
        <ContentSection
          v-for="(subSection, subIndex) in section"
          :key="subIndex"
          :section="subSection"
        />
      </b-container>
      <ContentSection
        v-else
        :key="index"
        :section="section"
      />
    </template>
  </div>
</template>

<script>
  import ContentHeader from '../content/ContentHeader';
  import ContentSection from '../content/ContentSection';
  import splitSections from '@/utils/contentful/splitSections';

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

    data() {
      return {
        browseAndScrollifySections: splitSections(this.hasPartCollection.items, 'MapSection')
      };
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

    @media (min-width: $bp-4k) {
      padding-bottom: 1.5rem;
    }
  }

  .browse-page-4-col {
    @media (min-width: $bp-wqhd) {
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
