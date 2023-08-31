<template>
  <div
    class="page white-page xxl-page"
  >
    <LandingHero
      :headline="headline"
      :text="text"
      :cta="cta"
      :hero-image="primaryImageOfPage"
    />
    <div
      v-for="(section, index) in sections"
      :key="index"
    >
      <LandingInfoCardGroup
        v-if="contentType(section, 'InfoCardGroup')"
        :title="section.name"
        :text="section.text"
        :info-cards="section.hasPartCollection && section.hasPartCollection.items"
      />
      <LandingImageCardGroup
        v-if="contentType(section, 'ImageCardGroup')"
        :title="section.name"
        :text="section.text"
        :image-cards="section.hasPartCollection && section.hasPartCollection.items"
      />
      <LandingSubSection
        v-if="contentType(section, 'LandingSubSection')"
        :title="section.name"
        :text="section.text"
        :sections="section.hasPartCollection && section.hasPartCollection.items"
      />
      <LandingEmbed
        v-if="contentType(section, 'EmbedSection')"
        :title="section.name"
        :text="section.text"
        :background-image="section.image"
        :embed="section.embed"
      />
    </div>
  </div>
</template>

<script>
  import LandingHero from '@/components/landing/LandingHero';

  export default {
    name: 'LandingPage',

    components: {
      LandingHero,
      LandingInfoCardGroup: () => import('@/components/landing/LandingInfoCardGroup'),
      LandingImageCardGroup: () => import('@/components/landing/LandingImageCardGroup'),
      LandingSubSection: () => import('@/components/landing/LandingSubSection'),
      LandingEmbed: () => import('@/components/landing/LandingEmbed')
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
  }
</style>
