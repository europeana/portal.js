<template>
  <div
    class="page white-page xxl-page"
  >
    <LandingHero
      :headline="html(headline)"
      :text="html(text)"
      :cta="cta"
      :hero-image="primaryImageOfPage"
    />
    <div
      v-for="(section, index) in sections"
      :key="index"
    >
      <LandingIllustrationGroup
        v-if="contentType(section, 'IllustrationGroup')"
        :title="section.name"
        :text="html(section.text)"
        :illustrations="section.hasPartCollection && section.hasPartCollection.items"
        :html="html"
      />
    </div>
  </div>
</template>

<script>
  import LandingHero from '@/components/landing/LandingHero';
  import { marked } from 'marked';

  export default {
    name: 'LandingPage',

    components: {
      LandingHero,
      LandingIllustrationGroup: () => import('@/components/landing/LandingIllustrationGroup')
    },

    props: {
      headline: {
        type: String,
        required: true
      },
      text: {
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
        return text ? marked.parse(text) : text;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/mixins';
  @import '@europeana/style/scss/transitions';

  .page {
    margin-top: -1rem;

    @media (min-width: $bp-4k) {
      margin-top: -1.5rem;
    }

    ::v-deep h2 {
      font-family: $font-family-ubuntu;
      font-size: $font-size-medium;
      font-weight: 500;

      @media (min-width: $bp-medium) {
        font-size: $font-size-xl;
      }

      @media (min-width: $bp-4k) {
        font-size: $font-size-xl-4k;
      }
    }

  }
</style>
