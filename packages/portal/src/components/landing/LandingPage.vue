<template>
  <div
    class="landing-page xxl-page"
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
      v-for="(section, index) in sectionsWithClasses"
      :id="sectionId(section)"
      :key="index"
      class="scroll-margin-top"
      :class="section.classes"
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
        :background-image="section.image"
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

    computed: {
      sectionsWithClasses() {
        // reduce instead of map to be able to access the previous modified section and read the added class
        return this.sections.reduce(this.addClassesToSections, []);
      }
    },

    methods: {
      contentfulEntryHasContentType,

      sectionId(section) {
        return kebabCase(section.nameEN);
      },

      isSubSectionOrCardGroup(section) {
        return this.contentfulEntryHasContentType(section, 'LandingSubSection') || this.contentfulEntryHasContentType(section, 'CardGroup');
      },

      addClassesToSections(memo, section, index) {
        const sectionBackground = section.profile?.background || section.image?.profile?.background;
        const classes = [];

        if (this.contentfulEntryHasContentType(section, 'ImageCard')) {
          classes.push('image-card-container-wrapper');
        }
        if (sectionBackground) {
          // image card group with highlight profile only highlights the header of the secion; skip background class
          if (!(this.contentfulEntryHasContentType(section, 'ImageCardGroup') && sectionBackground === 'highlight')) {
            classes.push(`bg-color-${sectionBackground}`);
          }
        }

        // add alternate background to landing sub section and card group when preceding section has no background
        if (this.variant === 'pro' && this.isSubSectionOrCardGroup(section)) {
          const prev = memo[index - 1];

          // subsequent card group follows background style of preceding card group
          const subsequentCardGroup = this.contentfulEntryHasContentType(section, 'CardGroup') && this.contentfulEntryHasContentType(prev, 'CardGroup');
          const prevSectionHasBackgroundClass = prev?.classes?.some(c => c === 'bg-color-alternate' ||  c === 'bg-color-highlight');
          const prevSectionHasBackground = index === 0 || prevSectionHasBackgroundClass;

          if ((subsequentCardGroup && prevSectionHasBackground) ||
            (!subsequentCardGroup && !prevSectionHasBackground)) {
            classes.push('bg-color-alternate');
          }
        }

        memo.push({
          ...section,
          classes
        });

        return memo;
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/mixins';
  @import '@europeana/style/scss/landing';

  .landing-page {
    margin-top: -$page-header-height;
    border-bottom: 1px solid transparent; // fix for when any margin of the last component on the page causes grey bg to display

    @media (min-width: $bp-4k) {
      margin-top: -$page-header-height-4k;
    }

    .scroll-margin-top {
      scroll-margin-top: 3.5rem;

      @media (min-width: $bp-4k) {
        scroll-margin-top: 5rem;
      }
    }

    &.pro-page {
      > div:last-child {
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

  .landing-page.ds4ch-page {
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
