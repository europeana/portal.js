<template>
  <div
    class="page white-page xxl-page"
    :class="`${variant}-page`"
    data-qa="landing page"
  >
    <LandingHero
      :headline="headline"
      :text="text"
      :cta="cta"
      :hero-image="primaryImageOfPage"
      :variant="variant"
    />
    <template
      v-for="(section, index) in sections"
    >
      <b-col
        v-if="contentType(section, 'CardGroup')"
        :key="index"
      >
        <ContentCardSection
          :section="section"
        />
      </b-col>
      <LandingIllustrationGroup
        v-if="contentType(section, 'IllustrationGroup')"
        :key="index"
        :title="section.name"
        :text="section.text"
        :illustrations="section.hasPartCollection && section.hasPartCollection.items"
        :variant="variant"
      />
      <LandingInfoCardGroup
        v-if="contentType(section, 'InfoCardGroup')"
        :key="index"
        :title="section.name"
        :text="section.text"
        :info-cards="section.hasPartCollection && section.hasPartCollection.items"
      />
      <b-container
        v-if="contentType(section, 'ImageCard')"
        :key="index"
        class="image-card-container"
      >
        <LandingImageCard
          :card="section"
          :variant="variant"
        />
      </b-container>
      <LandingImageCardGroup
        v-if="contentType(section, 'ImageCardGroup')"
        :key="index"
        :title="section.name"
        :text="section.text"
        :image-cards="section.hasPartCollection && section.hasPartCollection.items"
      />
      <LandingSubSection
        v-if="contentType(section, 'LandingSubSection')"
        :key="index"
        :title="section.name"
        :text="section.text"
        :sections="section.hasPartCollection && section.hasPartCollection.items"
        :variant="variant"
      />
      <LandingEmbed
        v-if="contentType(section, 'EmbedSection')"
        :key="index"
        :english-title="section.nameEN"
        :title="section.name"
        :text="section.text"
        :background-image="section.image"
        :embed="section.embed"
      />
      <LandingCallToAction
        v-if="contentType(section, 'PrimaryCallToAction')"
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

    ::v-deep .container {
      @media (max-width: $bp-small) {
        padding-right: 2rem;
        padding-left: 2rem;
      }
    }
  }
</style>

<!-- Only DS4CH styles after this line! -->
<style lang="scss" scoped>
  @import '@europeana/style/scss/DS4CH/style';

  .ds4ch-page {
    .image-card-container {
      margin-top: 3rem;

      @media (min-width: $bp-large) {
        margin-top: 6rem;
      }

      + .image-card-container {
        margin-top: 0rem;

        @media (min-width: $bp-large) {
          margin-top: -2rem;
        }
      }

      @media (min-width: $bp-large) and (max-width: $bp-xxxl) {
        max-width: none;
        padding-left: 0;
        padding-right: 0;
      }
    }
  }
</style>
