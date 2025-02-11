<template>
  <div
    class="page landing-page white-page xxl-page"
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
      :cta-help-text="ctaHelpText"
      :hero-image="primaryImageOfPage"
    />
    <div
      v-for="(section, index) in sections"
      :id="sectionId(section)"
      :key="index"
      class="scroll-margin-top"
      :class="getClasses(section)"
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
      <b-container
        v-else-if="contentfulEntryHasContentType(section, 'ImageCard')"
        class="image-card-container"
      >
        <LandingImageCard
          :card="section"
          :variant="variant"
        />
      </b-container>

      <LandingImageCardGroup
        v-else-if="contentfulEntryHasContentType(section, 'ImageCardGroup')"
        :title="section.name"
        :text="section.text"
        :image-cards="section.hasPartCollection && section.hasPartCollection.items"
        :background-image="section.image"
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
        :link="section.link"
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
  import contentfulEntryHasContentType from '@/utils/contentful/entryHasContentType.js';

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
      ctaHelpText: {
        type: String,
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
      contentfulEntryHasContentType,

      getClasses(section) {
        const classes = [];
        if (section.profile?.background) {
          classes.push(`bg-color-${section.profile.background}`);
        }
        if (this.contentfulEntryHasContentType(section, 'ImageCard')) {
          classes.push('image-card-container-wrapper');
        }
        return classes;
      },

      sectionId(section) {
        return kebabCase(section.nameEN);
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/mixins';
  @import '@europeana/style/scss/landing';

  .page {
    margin-top: -1rem;
    border-bottom: 1px solid transparent; // fix for when any margin of the last component on the page causes grey bg to display

    @media (min-width: $bp-4k) {
      margin-top: -1.5rem;
    }

    .scroll-margin-top {
      scroll-margin-top: 3.5rem;

      @media (min-width: $bp-4k) {
        scroll-margin-top: 5rem;
      }
    }

    &.pro-page {
      div:last-child {
        .bg-color-alternate,
        .bg-lightgrey {
          @include white-cutout;

          &:after {
            border-top-color: $lightgrey;
            z-index: 1;
          }
        }
      }
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
  }
</style>
