<template>
  <div
    class="page white-page xxl-page"
    :class="`${variant}-page`"
  >
    <LandingHero
      :headline="headline"
      :text="text"
      :cta="cta"
      :hero-image="primaryImageOfPage"
      :variant="variant"
    />
    <div
      v-for="(section, index) in sections"
      :key="index"
    >
      <ContentCardSection
        v-if="contentType(section, 'CardGroup')"
        :section="section"
      />
      <LandingIllustrationGroup
        v-if="contentType(section, 'IllustrationGroup')"
        :title="section.name"
        :text="section.text"
        :illustrations="section.hasPartCollection && section.hasPartCollection.items"
        :variant="variant"
      />
      <LandingInfoCardGroup
        v-if="contentType(section, 'InfoCardGroup')"
        :title="section.name"
        :text="section.text"
        :info-cards="section.hasPartCollection && section.hasPartCollection.items"
      />
      <LandingImageCard
        v-if="contentType(section, 'ImageCard')"
        :card="section"
        :variant="variant"
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
        :variant="variant"
      />
      <LandingEmbed
        v-if="contentType(section, 'EmbedSection')"
        :english-title="section.nameEN"
        :title="section.name"
        :text="section.text"
        :background-image="section.image"
        :embed="section.embed"
      />
      <LandingCallToAction
        v-if="contentType(section, 'PrimaryCallToAction')"
        :title="section.name"
        :text="section.text"
        :link="section.relatedLink"
        :background-image="section.image"
        :variant="variant"
      />
    </div>
  </div>
</template>

<script>
  import LandingHero from '@/components/landing/LandingHero';

  export default {
    name: 'LandingPage',

    components: {
      ContentCardSection: () => import('../content/ContentCardSection'),
      LandingCallToAction: () => import('@/components/landing/LandingCallToAction'),
      LandingHero,
      LandingIllustrationGroup: () => import('@/components/landing/LandingIllustrationGroup'),
      LandingInfoCardGroup: () => import('@/components/landing/LandingInfoCardGroup'),
      LandingImageCard: () => import('@/components/landing/LandingImageCard'),
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
      },
      /**
       * Variant to define layout and style
       * @values pro, ds4ch
       */
      variant: {
        type: String,
        default: 'pro'
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
