<template>
  <b-container>
    <div class="header mx-auto">
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
      <LandingInfoCardGroup
        v-if="contentType(section, 'InfoCardGroup')"
        :variant="LandingInfoCardGroupVariant"
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
        LandingInfoCardGroupVariant: this.$route.params.pathMatch === 'share-your-data' ? 'logo' : null
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
    padding-top: 4rem;
    padding-bottom: 2rem;

    @media (min-width: $bp-medium) {
      padding-bottom: 4rem;
    }
  }

  .header {
    max-width: $max-text-column-width;

    h2 {
      font-family: $font-family-ubuntu;
      font-size: $font-size-large;
      font-weight: 500;

      @media (min-width: $bp-medium) {
        font-size: $font-size-xl;
      }

      @media (min-width: $bp-4k) {
        font-size: $font-size-xl-4k;
      }
    }
  }

  .text {
    color: $mediumgrey;
  }
</style>

<docs lang="md">
  ```jsx
    <LandingSubSection
      title="This is a title for a sub section"
      text="A __description__ what this section is all about"
      :sections="[
        { __typename: 'InfoCardGroup',
          name: 'This is a title for an info card group',
          text: 'A __description__ what this section is all about',
          hasPartCollection: { items:
            [ {
              __typename: 'InfoCard',
              name: 'Usage statistics',
              text: 'Europeana’s usage statistics reports tell you how your data is being accessed and reused on Europeana.eu, empowering you __to measure__ the positive __impact__ of sharing your collections.',
              image: { url: 'https://images.ctfassets.net/i01duvb6kq77/1DxiDhy46cX5eBheNYFdP7/42518b79959f2ea5cd270f9cffa022b2/homepage_A_v4_blackline.svg',
              contentType: 'image/svg+xml', description: '', width: 111, height: 111 }
            }, {
              __typename: 'InfoCard',
              name: 'Usage statistics',
              text: 'Europeana’s usage statistics reports tell you how your data is being accessed and reused on Europeana.eu, empowering you __to measure__ the positive __impact__ of sharing your collections.',
              image: { url: 'https://images.ctfassets.net/i01duvb6kq77/1DxiDhy46cX5eBheNYFdP7/42518b79959f2ea5cd270f9cffa022b2/homepage_A_v4_blackline.svg',
              contentType: 'image/svg+xml', description: '', width: 111, height: 111 }
            }, {
              __typename: 'InfoCard',
              name: 'Usage statistics',
              text: 'Europeana’s usage statistics reports tell you how your data is being accessed and reused on Europeana.eu, empowering you __to measure__ the positive __impact__ of sharing your collections.',
              image: { url: 'https://images.ctfassets.net/i01duvb6kq77/1DxiDhy46cX5eBheNYFdP7/42518b79959f2ea5cd270f9cffa022b2/homepage_A_v4_blackline.svg',
              contentType: 'image/svg+xml', description: '', width: 111, height: 111 }
            } ]
          }
        }
      ]"
    />
  ```
</docs>
