<template>
  <div
    class="landing-sub-section"
    :class="[variant, { 'bg-bodygrey': variant === 'pro' }]"
  >
    <b-container class="landing-sub-section-container">
      <div class="header mx-auto">
        <h2 class="mx-auto">
          {{ title }}
        </h2>
        <!-- eslint-disable vue/no-v-html -->
        <div
          v-if="text"
          class="text mx-auto mb-3"
          v-html="parseMarkdownHtml(text)"
        />
        <!-- eslint-enable vue/no-v-html -->
      </div>
      <div
        v-for="(section, index) in sections"
        :key="index"
      >
        <LandingContentCardGroup
          v-if="contentfulEntryHasContentType(section, 'CardGroup')"
          :section="section"
          :variant="variant"
          title-tag="h3"
        />
        <LandingImageCard
          v-if="contentfulEntryHasContentType(section, 'ImageCard')"
          :card="section"
          :variant="variant"
          title-tag="h3"
        />
        <LandingAutomatedCardGroup
          v-if="contentfulEntryHasContentType(section, 'AutomatedCardGroup')"
          :genre="section.genre"
          :static-items="section.staticItems"
          :variant="variant"
        />
        <LandingInfoCardGroup
          v-if="contentfulEntryHasContentType(section, 'InfoCardGroup')"
          :class="LandingInfoCardGroupClass"
          :title="section.name"
          title-tag="h3"
          :text="section.text"
          :info-cards="section.hasPartCollection && section.hasPartCollection.items"
          :link="section.link"
        />
      </div>
    </b-container>
  </div>
</template>

<script>
  import contentfulEntryHasContentType from '@/utils/contentful/entryHasContentType.js';
  import parseMarkdownHtmlMixin from '@/mixins/parseMarkdownHtml';

  export default {
    name: 'LandingSubSection',

    components: {
      LandingContentCardGroup: () => import('@/components/landing/LandingContentCardGroup'),
      LandingAutomatedCardGroup: () => import('@/components/landing/LandingAutomatedCardGroup'),
      LandingImageCard: () => import('@/components/landing/LandingImageCard'),
      LandingInfoCardGroup: () => import('@/components/landing/LandingInfoCardGroup')
    },

    mixins: [parseMarkdownHtmlMixin],

    props: {
      /**
       * H2 title to display above the info cards
       */
      title: {
        type: String,
        default: null
      },
      /**
       * Text to display under title and above the info cards
       */
      text: {
        type: String,
        default: null
      },
      /**
       * List of sections
       */
      sections: {
        type: Array,
        default: () => []
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

    // TODO: Remove once replaced with LandingIllustrationGroup
    data() {
      return {
        LandingInfoCardGroupClass: this.$route.params.pathMatch === 'share-your-data' ? 'logo' : null
      };
    },

    methods: {
      contentfulEntryHasContentType
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .landing-sub-section {
    background-color: $bodygrey;
  }

  .landing-sub-section-container {
    padding-top: 3rem;
    border-bottom: 1px solid transparent; // fix for when any margin of the last child component causes different bg to display

    @media (min-width: $bp-large) {
      padding-top: 6rem;
    }

    @media (min-width: $bp-4k) {
      padding-top: 15rem;
    }
  }

  .header {
    max-width: 1250px;
    padding-bottom: 1rem;
    text-align: center;

    @media (min-width: $bp-medium) {
      padding-bottom: 4rem;
    }

    @media (min-width: $bp-4k) {
      max-width: 2500px;
      padding-bottom: 8rem;
    }

    h2 {
      max-width: $max-text-column-width;

      @media (min-width: $bp-4k) {
        max-width: $max-text-column-width-landing-4k;
      }
    }
  }

  .text {
    color: $mediumgrey;
    max-width: $max-text-column-width;

    @media (min-width: $bp-4k) {
      max-width: $max-text-column-width-landing-4k;
    }
  }

  ::v-deep .landing-content-card-group .container {
    max-width: none;
  }

  // TODO: Remove once replaced with LandingIllustrationGroup
  //style overrides for providing institutions section Share your data
  ::v-deep .logo {
    &.container {
      padding: 0;
      margin-bottom: 2rem;

      @media (min-width: $bp-large) {
        margin-bottom: 4rem;
      }

      @media (min-width: $bp-4k) {
        margin-bottom: 15rem;
      }
    }

    .cards-wrapper {
      display: flex;
      flex-wrap: wrap;
      justify-content: center !important;
    }

    .info-card {
      flex-basis: calc(50% - 2rem);
      margin: 0 1rem 1rem;
      padding: 0;
      align-items: center;
      justify-content: center;

      @media (min-width: $bp-small) {
        flex-basis: calc(25% - 2rem);
      }

      @media (min-width: $bp-large) {
        margin: 0 1.5rem 1rem;
        flex-basis: 127px;
      }

      @media (min-width: $bp-4k) {
        margin: 0 2rem 1rem;
        flex-basis: calc(1.5 * 127px);
      }

      .title {
        display: none;
      }
      .image-wrapper {
        flex: 0 0 100%;
        height: auto;
        width: 100%;
        max-width: 127px;

        @media (min-width: $bp-4k) {
          max-width: calc(1.5 * 127px);
        }

        img {
          mix-blend-mode: multiply; // fixes logo img with white background
        }
      }
    }
  }
</style>

<!-- Only DS4CH styles after this line! -->
<style lang="scss" scoped>
  @import '@europeana/style/scss/DS4CH/variables';

  .landing-sub-section.ds4ch {
    background-color: transparent;

    .container {
      padding-top: 0;
      padding-bottom: 0;
      border-bottom: none;
      margin-top: 3rem;

      @media(min-width: $bp-large) {
        margin-top: 6rem;
      }

      @media(min-width: $bp-4k) {
        margin-top: 15rem;
      }
    }

    .header {
      padding-bottom: 0;

      @media(min-width: $bp-medium) {
        padding-bottom: 1rem;
      }

      @media(min-width: $bp-4k) {
        padding-bottom: 10rem;
      }

      h2 {
        font-family: $font-family-montserrat;
        font-size: 1.375rem;
        font-weight: 700;
        line-height: 1.2;
        margin-left: auto;
        margin-right: auto;

        @media(min-width: $bp-medium) {
          font-size: $font-size-xl;
        }
        @media(min-width: $bp-4k) {
          font-size: 5.625rem;
          max-width: $max-text-column-width-landing-4k;
        }
      }

      .text {
        color: $black;
        margin-left: auto;
        margin-right: auto;
        text-align: center;

        @media (min-width: $bp-4k) {
          font-size: 2.5rem;
          max-width: $max-text-column-width-landing-4k;
        }
      }
    }

    .ds4ch.image-card {
      padding-top: 0;
      padding-bottom: 0;

      @media (min-width: $bp-xxl) {
        max-width: 1500px;
      }

      @media(min-width: $bp-extralarge) {
        margin-left: -4rem;
        margin-right: -4rem;
      }

      @media(min-width: $bp-xxl) {
        margin-left: auto;
        margin-right: auto;
      }

      @media (min-width: $bp-4k) {
        max-width: 3000px;
      }

      &.image-card-odd {
        ::v-deep .text-wrapper {
          padding-right: 0;
        }
      }
    }
  }
</style>

<docs lang="md">
  ```jsx
    import '@europeana/style/scss/landing.scss';
    <div class="landing-page xxl-page">
      <LandingSubSection
        title="This is a title for a sub section"
        text="A __description__ what this section is all about"
        :sections="[
                    {
            __typename: 'AutomatedCardGroup',
            genre: 'Europeana numbers',
            staticItems:[ { info: '16,000 +', label: 'Visits per day' }, { info: '57,000,000 +', label: 'Items' }, { info: '2,600 +', label: 'Providing institutions' } ]
          },
          {
            __typename: 'InfoCardGroup',
            name: 'This is a title for an info card group',
            text: 'A __description__ what this section is all about',
            hasPartCollection: { items:
              [ {
                __typename: 'InfoCard',
                name: 'Info card title',
                text: 'This text contains info. It can be __marked__ and accompanied by an image.',
                image: {
                  url: illustrations.support,
                  contentfulEntryHasContentType: 'image/svg+xml', description: '', width: 111, height: 111
                }
              }, {
                __typename: 'InfoCard',
                name: 'Info card title',
                text: 'This text contains info. It can be __marked__ and accompanied by an image.',
                image: {
                  url: illustrations.support,
                  contentfulEntryHasContentType: 'image/svg+xml', description: '', width: 111, height: 111
                }
              }, {
                __typename: 'InfoCard',
                name: 'Info card title',
                text: 'This text contains info. It can be __marked__ and accompanied by an image.',
                image: {
                  url: illustrations.support,
                  contentfulEntryHasContentType: 'image/svg+xml', description: '', width: 111, height: 111
                }
              } ]
            }
          }
        ]"
      />
    </div>
  ```
</docs>
