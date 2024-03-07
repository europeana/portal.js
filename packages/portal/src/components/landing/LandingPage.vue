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
    <template
      v-for="(section, index) in sections"
    >
      <b-col
        v-if="contentfulEntryHasContentType(section, 'CardGroup')"
        :key="index"
      >
        <ContentCardSection
          :section="section"
        />
      </b-col>
      <LandingIllustrationGroup
        v-else-if="contentfulEntryHasContentType(section, 'IllustrationGroup')"
        :key="index"
        :title="section.name"
        :text="section.text"
        :illustrations="section.hasPartCollection && section.hasPartCollection.items"
        :variant="variant"
      />
      <LandingInfoCardGroup
        v-else-if="contentfulEntryHasContentType(section, 'InfoCardGroup')"
        :key="index"
        :title="section.name"
        :text="section.text"
        :info-cards="section.hasPartCollection && section.hasPartCollection.items"
        :link="section.link"
        :variant="variant"
      />
      <div
        v-else-if="contentfulEntryHasContentType(section, 'ImageCard')"
        :key="index"
        class="image-card-container-wrapper"
        :class="getClasses(section)"
      >
        <b-container class="image-card-container">
          <LandingImageCard
            :card="section"
            :variant="variant"
          />
        </b-container>
      </div>
      <LandingImageCardGroup
        v-else-if="contentfulEntryHasContentType(section, 'ImageCardGroup')"
        :key="index"
        :title="section.name"
        :text="section.text"
        :image-cards="section.hasPartCollection && section.hasPartCollection.items"
      />
      <LandingSubSection
        v-else-if="contentfulEntryHasContentType(section, 'LandingSubSection')"
        :key="index"
        :title="section.name"
        :text="section.text"
        :sections="section.hasPartCollection && section.hasPartCollection.items"
        :variant="variant"
      />
      <LandingEmbed
        v-else-if="contentfulEntryHasContentType(section, 'EmbedSection')"
        :key="index"
        :english-title="section.nameEN"
        :title="section.name"
        :text="section.text"
        :background-image="section.image"
        :embed="section.embed"
      />
      <LandingCallToAction
        v-else-if="contentfulEntryHasContentType(section, 'PrimaryCallToAction')"
        :key="index"
        :title="section.name"
        :text="section.text"
        :link="section.relatedLink"
        :background-image="section.image"
        :variant="variant"
      />
    </template>
  </div>
</template>

<script>
  import LandingHero from '@/components/landing/LandingHero';
  import landingPageMixin from '@/mixins/landingPage.js';
  import contentfulMixin from '@/mixins/contentful.js';
  import parityMixin from '@/mixins/parity.js';

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
      LandingEmbed: () => import('@/components/landing/LandingEmbed'),
      DS4CHLandingHero: () => import('@/components/DS4CH/DS4CHLandingHero')
    },

    mixins: [
      contentfulMixin,
      landingPageMixin,
      parityMixin
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
    },

    mounted() {
      this.$nextTick(() => this.markParity('image-card'));
    },

    methods: {
      getClasses(section) {
        return section.profile?.background ? `bg-color-${section.profile.background}` : '';
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

    ::v-deep .container {
      @media (max-width: $bp-small) {
        padding-right: 2rem;
        padding-left: 2rem;
      }
    }

    .bg-color-alternate {
      background-color: $bodygrey;
    }
  }
</style>

<!-- Only DS4CH styles after this line! -->
<style lang="scss" scoped>
  @import '@europeana/style/scss/DS4CH/style';

  .ds4ch-page {
    .image-card-container {
      @media (min-width: $bp-large) {
        max-width: none;
        padding-left: 0;
        padding-right: 0;
      }
    }
    .image-card-container-wrapper {
      + .image-card-container-wrapper {
        margin-top: -4rem;

        @media (min-width: $bp-large) {
          margin-top: -8rem;
        }

        @media (min-width: $bp-4k) {
          margin-top: -20rem;
        }
      }

      @media (min-width: $bp-large) {
        &:nth-child(even) {
          ::v-deep .text-wrapper {
            order: -1;
          }
        }
      }
    }
  }
</style>

<style lang="scss">
  @import '@europeana/style/scss/DS4CH/style';

  .page.ds4ch-page {
    margin-top: 0;

    &:after {
      content: none;
    }
  }
</style>
