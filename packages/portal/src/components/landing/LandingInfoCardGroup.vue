<template>
  <b-container class="text-center">
    <div class="header mx-auto pb-1">
      <h2>
        {{ title }}
      </h2>
      <!-- eslint-disable vue/no-v-html -->
      <div
        v-if="text"
        class="mb-3"
        v-html="html(text)"
      />
    <!-- eslint-enable vue/no-v-html -->
    </div>
    <div
      v-if="infoCards.length"
      class="d-lg-inline-flex mx-auto"
    >
      <LandingInfoCard
        v-for="(card, index) in infoCards"
        :key="index"
        class="info-card"
        :card="card"
      />
    </div>
  </b-container>
</template>

<script>
  import parseMarkdownMixin from '@/mixins/parseMarkdownHtml';

  export default {
    name: 'LandingInfoCardGroup',

    components: {
      LandingInfoCard: () => import('@/components/landing/LandingInfoCard')
    },

    mixins: [parseMarkdownMixin],

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
       * List of info cards
       */
      infoCards: {
        type: Array,
        default: () => []
      }
    }
  };
</script>

<style lang="scss" scoped>
@import '@europeana/style/scss/variables';

.container {
  padding-top: 4rem;
  padding-bottom: 3rem;

  @media (min-width: $bp-large) {
    padding-top: 4.5rem;
  }
}

.header {
  max-width: $max-text-column-width;
}
</style>

<docs lang="md">
  ```jsx
    <LandingInfoCardGroup
      title="This is a title for an info card group"
      text="A __description__ what this section is all about"
      :info-cards="[ {
        __typename: 'InfoCard',
        name: 'Usage statistics',
        text: 'Europeana’s usage statistics reports tell you how your data is being accessed and reused on Europeana.eu, empowering you __to measure__ the positive __impact__ of sharing your collections.',
      image: { url: 'https://images.ctfassets.net/i01duvb6kq77/cjliScwekoFTMkuD4XGHI/7831ed1ea5942256bca70542e7db0739/noun-stats-5341287_1.svg',
      contentType: 'image/svg+xml', description: '', width: 111, height: 111 }
    }, {
      __typename: 'InfoCard',
    name: 'Usage statistics',
      text: 'Europeana’s usage statistics reports tell you how your data is being accessed and reused on Europeana.eu, empowering you __to measure__ the positive __impact__ of sharing your collections.',
      image: { url: 'https://images.ctfassets.net/i01duvb6kq77/cjliScwekoFTMkuD4XGHI/7831ed1ea5942256bca70542e7db0739/noun-stats-5341287_1.svg',
      contentType: 'image/svg+xml', description: '', width: 111, height: 111 }
    },
      {
        __typename: 'InfoCard',
        name: 'Usage statistics',
        text: 'Europeana’s usage statistics reports tell you how your data is being accessed and reused on Europeana.eu, empowering you __to measure__ the positive __impact__ of sharing your collections.',
        image: { url: 'https://images.ctfassets.net/i01duvb6kq77/cjliScwekoFTMkuD4XGHI/7831ed1ea5942256bca70542e7db0739/noun-stats-5341287_1.svg',
        contentType: 'image/svg+xml', description: '', width: 111, height: 111 }
      } ]"
    />
  ```
</docs>
