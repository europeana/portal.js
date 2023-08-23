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
    <div class="d-lg-inline-flex mx-auto">
      <div
        v-for="(card, index) in infoCards"
        :key="index"
        class="info-card"
      >
        <div class="image-wrapper d-flex flex-end justify-content-center mb-2">
          <ImageOptimised
            class="image"
            :alt="card.image.description"
            :src="card.image.url"
            :width="card.image.width"
            :height="card.image.height"
            :content-type="card.image.contentType"
            :max-width="1100"
            :lazy="true"
          />
        </div>
        <h3 class="title mb-2">
          {{ card.name }}
        </h3>
        <!-- eslint-disable vue/no-v-html -->
        <div
          class="text"
          v-html="html(card.text)"
        />
        <!-- eslint-enable vue/no-v-html -->
      </div>
    </div>
  </b-container>
</template>

<script>
  import ImageOptimised from '@/components/image/ImageOptimised';
  import parseMarkdownMixin from '@/mixins/parseMarkdownHtml';

  export default {
    name: 'LandingInfoCardGroup',

    components: {
      ImageOptimised
    },

    mixins: [parseMarkdownMixin],

    props: {
      title: {
        type: String,
        default: null
      },
      text: {
        type: String,
        default: null
      },
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

.info-card {
  max-width: 310px;
  margin-left: auto;
  margin-right: auto;

  @media (min-width: $bp-large) {
    margin-left: 2rem;
    margin-right: 2rem;
  }

  @media (min-width: $bp-4k) {
    max-width: calc(1.5 * 310px);
    margin-left: 3rem;
    margin-right: 3rem;
  }
}
.image-wrapper {
  height: 80px;

  @media (min-width: $bp-large) {
    height: 111px;
  }
}

.image {
  max-height: 100%;
  margin: auto auto 0 auto;
}

.title {
  color: $mediumgrey;
  font-family: $font-family-ubuntu;
  font-weight: 500;
  text-transform: uppercase;
}

.text {
  font-weight: 500;
  color: $mediumgrey;
  margin-bottom: 2rem;
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
