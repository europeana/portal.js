<template>
  <div>
    <h2>{{ title }}</h2>
    <!-- eslint-disable vue/no-v-html -->
    <div
      v-html="text"
    />
    <!-- eslint-enable vue/no-v-html -->
    <div
      v-for="(illustration, index) in illustrations"
      :key="index"
    >
      <img :src="illustration.image.url">
      <h3>{{ illustration.name }}</h3>
      <!-- eslint-disable vue/no-v-html -->
      <div
        v-html="html(illustration.text)"
      />
    <!-- eslint-enable vue/no-v-html -->
    </div>
  </div>
</template>

<script>
  export default {
    name: 'LandingIllustrationGroup',

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
