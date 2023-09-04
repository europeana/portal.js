<template>
  <b-container>
    <div class="header mx-auto text-center text-lg-left">
      <h2>
        {{ title }}
      </h2>
      <!-- eslint-disable vue/no-v-html -->
      <div
        v-if="text"
        class="text mb-3"
        v-html="parseMarkdownHtml(text)"
      />
    <!-- eslint-enable vue/no-v-html -->
    </div>
    <div
      v-for="(section, index) in sections"
      :key="index"
    >
      <LandingAutomatedCardGroup
        v-if="contentType(section, 'AutomatedCardGroup')"
        :genre="section.genre"
        :static-items="section.staticItems"
      />
      <LandingInfoCardGroup
        v-if="contentType(section, 'InfoCardGroup')"
        :class="LandingInfoCardGroupClass"
        :title="section.name"
        title-tag="h3"
        :text="section.text"
        :info-cards="section.hasPartCollection && section.hasPartCollection.items"
      />
    </div>
  </b-container>
</template>

<script>
  import parseMarkdownHtmlMixin from '@/mixins/parseMarkdownHtml';

  export default {
    name: 'LandingSubSection',

    components: {
      LandingAutomatedCardGroup: () => import('@/components/landing/LandingAutomatedCardGroup'),
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
      }
    },

    data() {
      return {
        LandingInfoCardGroupClass: this.$route.params.pathMatch === 'share-your-data' ? 'logo' : null
      };
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

  .container {
    padding-top: 3.75rem;
    padding-bottom: 2rem;

    @media (min-width: $bp-medium) {
      padding-top: 4rem;
      padding-bottom: 4rem;
    }
  }

  .header {
    max-width: 1250px;
    padding-bottom: 1rem;

    @media (min-width: $bp-medium) {
      padding-bottom: 4rem;
    }

    h2 {
      font-family: $font-family-ubuntu;
      font-size: $font-size-large;
      font-weight: 500;
      margin-bottom: 0.5rem;
      max-width: $max-text-column-width;

      @media (min-width: $bp-medium) {
        font-size: $font-size-xl;
        margin-bottom: 1rem;
      }

      @media (min-width: $bp-4k) {
        font-size: $font-size-xl-4k;
      }
    }
  }

  .text {
    color: $mediumgrey;
    max-width: $max-text-column-width;
  }

  //style overrides for providing institutions section Share your data
  ::v-deep .logo {
    &.container {
      padding: 0;
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
      }
    }
  }
</style>

<docs lang="md">
  ```jsx
    <LandingSubSection
      title="This is a title for a sub section"
      text="A __description__ what this section is all about"
      :sections="[
        {
          __typename: 'InfoCardGroup',
          name: 'This is a title for an info card group',
          text: 'A __description__ what this section is all about',
          hasPartCollection: { items:
            [ {
              __typename: 'InfoCard',
              name: 'Info card title',
              text: 'This text contains info. It can be __marked__ and accompanied by an image. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
              image: {
                url: 'https://images.ctfassets.net/i01duvb6kq77/1DxiDhy46cX5eBheNYFdP7/42518b79959f2ea5cd270f9cffa022b2/homepage_A_v4_blackline.svg',
                contentType: 'image/svg+xml', description: '', width: 111, height: 111
              }
            }, {
              __typename: 'InfoCard',
              name: 'Info card title',
              text: 'This text contains info. It can be __marked__ and accompanied by an image. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
              image: {
                url: 'https://images.ctfassets.net/i01duvb6kq77/1DxiDhy46cX5eBheNYFdP7/42518b79959f2ea5cd270f9cffa022b2/homepage_A_v4_blackline.svg',
                contentType: 'image/svg+xml', description: '', width: 111, height: 111
              }
            }, {
              __typename: 'InfoCard',
              name: 'Info card title',
              text: 'This text contains info. It can be __marked__ and accompanied by an image. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
              image: {
                url: 'https://images.ctfassets.net/i01duvb6kq77/1DxiDhy46cX5eBheNYFdP7/42518b79959f2ea5cd270f9cffa022b2/homepage_A_v4_blackline.svg',
                contentType: 'image/svg+xml', description: '', width: 111, height: 111
              }
            } ]
          }
        },
        {
          __typename: 'AutomatedCardGroup',
          staticItems:[ { info: '16,000 +', label: 'Visits per day' }, { info: '57,000,000 +', label: 'Items' }, { info: '2,600 +', label: 'Providing institutions' } ]
        }
      ]"
    />
  ```
</docs>
