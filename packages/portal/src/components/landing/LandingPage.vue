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
      :id="sectionId(section)"
    >
      <LandingContentCardGroup
        v-if="contentfulEntryHasContentType(section, 'CardGroup')"
        :section="section"
        :variant="variant"
      />
      <LandingIllustrationGroup
        v-else-if="contentfulEntryHasContentType(section, 'IllustrationGroup')"
        :title="section.name"
        :text="section.text"
        :illustrations="section.hasPartCollection && section.hasPartCollection.items"
        :variant="variant"
      />
      <LandingInfoCardGroup
        v-else-if="contentfulEntryHasContentType(section, 'InfoCardGroup')"
        :title="section.name"
        :text="section.text"
        :info-cards="section.hasPartCollection && section.hasPartCollection.items"
        :link="section.link"
        :variant="variant"
      />
      <div
        v-else-if="contentfulEntryHasContentType(section, 'ImageCard')"
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
        :title="section.name"
        :text="section.text"
        :image-cards="section.hasPartCollection && section.hasPartCollection.items"
      />
      <LandingSubSection
        v-else-if="contentfulEntryHasContentType(section, 'LandingSubSection')"
        :title="section.name"
        :text="section.text"
        :sections="section.hasPartCollection && section.hasPartCollection.items"
        :variant="variant"
      />
      <LandingEmbed
        v-else-if="contentfulEntryHasContentType(section, 'EmbedSection')"
        :title="section.name"
        :text="section.text"
        :background-image="section.image"
        :embed="section.embed"
      />
      <LandingCallToAction
        v-else-if="contentfulEntryHasContentType(section, 'PrimaryCallToAction')"
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
  import kebabCase from 'lodash/kebabCase';
  import LandingHero from './LandingHero';
  import landingPageMixin from '@/mixins/landingPage.js';
  import contentfulMixin from '@/mixins/contentful.js';

  export default {
    name: 'LandingPage',

    components: {
      LandingContentCardGroup: () => import('./LandingContentCardGroup'),
      LandingCallToAction: () => import('./LandingCallToAction'),
      LandingHero,
      LandingIllustrationGroup: () => import('./LandingIllustrationGroup'),
      LandingInfoCardGroup: () => import('./LandingInfoCardGroup'),
      LandingImageCard: () => import('./LandingImageCard'),
      LandingImageCardGroup: () => import('./LandingImageCardGroup'),
      LandingSubSection: () => import('./LandingSubSection'),
      LandingEmbed: () => import('./LandingEmbed'),
      DS4CHLandingHero: () => import('../DS4CH/DS4CHLandingHero')
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
    },

    methods: {
      getClasses(section) {
        return section.profile?.background ? `bg-color-${section.profile.background}` : '';
      },

      sectionId(section) {
        return kebabCase(section.nameEN);
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
<style lang="scss">
  @import '@europeana/style/scss/DS4CH/style';

  .page.ds4ch-page {
    margin-top: 0;

    &:after {
      content: none;
    }

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
    }
  }
</style>
