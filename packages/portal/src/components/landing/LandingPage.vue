<template>
  <div
    class="page white-page xxl-page"
  >
    <div class="p-5 bg-primary" />
    <!-- Header/hero -->
    <div
      v-for="(section, index) in sections"
      :key="index"
    >
      <LandingIllustrationGroup
        v-if="contentType(section, 'IllustrationGroup')"
        :title="section.name"
        :text="html(section.text)"
        :illustrations="section.hasPartCollection.items"
        :html="html"
      />
    </div>
  </div>
</template>

<script>
  import { marked } from 'marked';

  export default {
    name: 'LandingPage',

    components: {
      LandingIllustrationGroup: () => import('@/components/landing/LandingIllustrationGroup')
    },

    props: {
      title: {
        type: String,
        default: null
      },
      headline: {
        type: String,
        default: null
      },
      cta: {
        type: Object,
        default: null
      },
      sections: {
        type: Array,
        default: () => []
      },
      primaryImageOfPage: {
        type: Object,
        default: null
      }
    },

    methods: {
      contentType(section, typeName) {
        return section && (section['__typename'] === typeName);
      },
      html(text) {
        return marked.parse(text);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/mixins';
  @import '@europeana/style/scss/transitions';

  .page {
    padding-top: 1rem;
    margin-top: -1rem;

    @media (min-width: $bp-4k) {
      padding-top: 1.5rem;
      margin-top: -1.5rem;
    }

    ::v-deep h2 {
      font-size: $font-size-medium;
      font-weight: 600;

      @media (min-width: $bp-medium) {
        font-size: $font-size-xl;
      }

      @media (min-width: $bp-4k) {
        font-size: $font-size-xl-4k;
      }
    }

  }
</style>
