<template>
  <div
    class="page white-page xxl-page"
    :class="`${variant}-page`"
    data-qa="landing page"
  >
    <DS4CHLandingHero
      v-if="variant === 'ds4ch'"
      :headline="headline"
      :text="text"
      :cta="cta"
      :hero-image="primaryImageOfPage"
    />
    <LandingHero
      v-else
      :headline="headline"
      :text="text"
      :cta="cta"
      :hero-image="primaryImageOfPage"
    />
    <div
      v-for="(section, index) in sections"
      :key="index"
    >
      <b-col v-if="contentfulEntryHasContentType(section, 'CardGroup')">
        <ContentCardSection
          :section="section"
        />
      </b-col>
      <LandingIllustrationGroup
        v-if="contentfulEntryHasContentType(section, 'IllustrationGroup')"
        :title="section.name"
        :text="section.text"
        :illustrations="section.hasPartCollection && section.hasPartCollection.items"
        :variant="variant"
      />
      <LandingInfoCardGroup
        v-if="contentfulEntryHasContentType(section, 'InfoCardGroup')"
        :title="section.name"
        :text="section.text"
        :info-cards="section.hasPartCollection && section.hasPartCollection.items"
      />
      <LandingImageCardGroup
        v-if="contentfulEntryHasContentType(section, 'ImageCardGroup')"
        :title="section.name"
        :text="section.text"
        :image-cards="section.hasPartCollection && section.hasPartCollection.items"
      />
      <LandingSubSection
        v-if="contentfulEntryHasContentType(section, 'LandingSubSection')"
        :title="section.name"
        :text="section.text"
        :sections="section.hasPartCollection && section.hasPartCollection.items"
        :variant="variant"
      />
      <LandingEmbed
        v-if="contentfulEntryHasContentType(section, 'EmbedSection')"
        :english-title="section.nameEN"
        :title="section.name"
        :text="section.text"
        :background-image="section.image"
        :embed="section.embed"
      />
      <LandingCallToAction
        v-if="contentfulEntryHasContentType(section, 'PrimaryCallToAction')"
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
  import landingPageMixin from '@/mixins/landingPage.js';
  import contentfulMixin from '@/mixins/contentful.js';

  export default {
    name: 'LandingPage',

    components: {
      ContentCardSection: () => import('../content/ContentCardSection'),
      LandingCallToAction: () => import('@/components/landing/LandingCallToAction'),
      LandingHero,
      LandingIllustrationGroup: () => import('@/components/landing/LandingIllustrationGroup'),
      LandingInfoCardGroup: () => import('@/components/landing/LandingInfoCardGroup'),
      LandingImageCardGroup: () => import('@/components/landing/LandingImageCardGroup'),
      LandingSubSection: () => import('@/components/landing/LandingSubSection'),
      LandingEmbed: () => import('@/components/landing/LandingEmbed'),
      DS4CHLandingHero: () => import('@/components/DS4CH/DS4CHLandingHero')
    },

    mixins: [
      contentfulMixin,
      landingPageMixin
    ],

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

    data() {
      return {
        /**
         * Variant to define layout and style
         * @values pro, ds4ch
         */
        variant: 'pro'
      };
    },

    created() {
      if (this.landingPageId === 'ds4ch') {
        this.variant = 'ds4ch';
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

<style lang="scss">
  @import '@europeana/style/scss/DS4CH/variables';

  .page.ds4ch-page {
    margin-top: 0;

    &:after {
      content: none;
    }
  }
</style>
