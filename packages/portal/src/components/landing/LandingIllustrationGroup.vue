<template>
  <b-container class="text-center">
    <div class="illustrations-header mx-auto pb-1">
      <h2>
        {{ title }}
      </h2>
      <!-- eslint-disable vue/no-v-html -->
      <div
        class="mb-3"
        v-html="text"
      />
    <!-- eslint-enable vue/no-v-html -->
    </div>
    <div class="d-lg-inline-flex mx-auto">
      <div
        v-for="(illustration, index) in illustrations"
        :key="index"
        class="illustration"
      >
        <div class="illustration-image-wrapper d-flex flex-end justify-content-center mb-2">
          <ImageOptimised
            class="illustration-image"
            :alt="illustration.image.description"
            :src="illustration.image.url"
            :width="illustration.image.width"
            :height="illustration.image.height"
            :content-type="illustration.image.contentType"
            :max-width="1100"
            :lazy="true"
          />
        </div>
        <h3 class="illustration-title mb-2">
          {{ illustration.name }}
        </h3>
        <!-- eslint-disable vue/no-v-html -->
        <div
          class="illustration-text"
          v-html="html(illustration.text)"
        />
        <!-- eslint-enable vue/no-v-html -->
      </div>
    </div>
  </b-container>
</template>

<script>
  import ImageOptimised from '@/components/image/ImageOptimised';

  export default {
    name: 'LandingIllustrationGroup',

    components: {
      ImageOptimised
    },

    props: {
      title: {
        type: String,
        default: null
      },
      text: {
        type: String,
        default: null
      },
      illustrations: {
        type: Array,
        default: () => []
      },
      html: {
        type: Function,
        default: () => null
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

.illustrations-header {
  max-width: $max-text-column-width;
}

.illustration {
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
.illustration-image-wrapper {
  height: 80px;

  @media (min-width: $bp-large) {
    height: 111px;
  }
}

.illustration-image {
  max-height: 100%;
  margin: auto auto 0 auto;
}

.illustration-title {
  color: $mediumgrey;
  font-family: $font-family-ubuntu;
  font-weight: 600;
  text-transform: uppercase;
}

.illustration-text {
  font-weight: 600;
  color: $mediumgrey;
  margin-bottom: 2rem;
}
</style>

<docs lang="md">
  ```jsx
    <LandingIllustrationGroup
      title="This is a title for an illustration group"
      text="A description what this section is all about"
      :illustrations="[ {
        __typename: 'Illustration',
        name: 'Usage statistics',
        text: 'Europeana’s usage statistics reports tell you how your data is being accessed and reused on Europeana.eu, empowering you __to measure__ the positive __impact__ of sharing your collections.',
      image: { url: 'https://images.ctfassets.net/i01duvb6kq77/cjliScwekoFTMkuD4XGHI/7831ed1ea5942256bca70542e7db0739/noun-stats-5341287_1.svg',
      contentType: 'image/svg+xml', description: '', width: 111, height: 111 }
    }, {
      __typename: 'Illustration',
    name: 'Usage statistics',
      text: 'Europeana’s usage statistics reports tell you how your data is being accessed and reused on Europeana.eu, empowering you __to measure__ the positive __impact__ of sharing your collections.',
      image: { url: 'https://images.ctfassets.net/i01duvb6kq77/cjliScwekoFTMkuD4XGHI/7831ed1ea5942256bca70542e7db0739/noun-stats-5341287_1.svg',
      contentType: 'image/svg+xml', description: '', width: 111, height: 111 }
    },
      {
        __typename: 'Illustration',
        name: 'Usage statistics',
        text: 'Europeana’s usage statistics reports tell you how your data is being accessed and reused on Europeana.eu, empowering you __to measure__ the positive __impact__ of sharing your collections.',
        image: { url: 'https://images.ctfassets.net/i01duvb6kq77/cjliScwekoFTMkuD4XGHI/7831ed1ea5942256bca70542e7db0739/noun-stats-5341287_1.svg',
        contentType: 'image/svg+xml', description: '', width: 111, height: 111 }
      } ]"
    />
  ```
</docs>
