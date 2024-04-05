<template>
  <div
    class="info-card d-inline-flex flex-wrap flex-lg-nowrap"
    :class="{ 'column flex-column align-items-center text-center': columnCard }"
    data-qa="landing info card"
  >
    <div
      v-if="card.image"
      class="image-wrapper mx-auto mx-lg-0"
      data-qa="landing info card image"
    >
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
    <div
      class="text-wrapper"
      :class="{
        'ml-lg-3': !columnCard,
        'mb-3': columnCard }"
    >
      <h3
        class="title text-center"
        :class="{ 'text-lg-left': !columnCard }"
      >
        {{ card.name }}
      </h3>
      <!-- eslint-disable vue/no-v-html -->
      <div
        v-if="card.text"
        class="text"
        data-qa="landing info card text"
        v-html="parseMarkdownHtml(card.text)"
      />
    <!-- eslint-enable vue/no-v-html -->
    </div>
    <SmartLink
      v-if="card.link"
      :destination="card.link.url"
      class="btn btn-outline-primary mt-auto"
      hide-external-icon
      data-qa="landing info card link"
    >
      {{ card.link.text }}
    </SmartLink>
  </div>
</template>

<script>
  import parseMarkdownHtmlMixin from '@/mixins/parseMarkdownHtml';

  export default {
    name: 'LandingInfoCard',

    components: {
      ImageOptimised: () => import('@/components/image/ImageOptimised'),
      SmartLink: () => import('@/components/generic/SmartLink')
    },

    mixins: [parseMarkdownHtmlMixin],

    props: {
      /**
       * Info card data
       */
      card: {
        type: Object,
        default: null
      },
      /**
       * Defines the layout of the card
       */
      columnCard: {
        type: Boolean,
        default: false
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .info-card {
    margin-bottom: 3rem;

    @media (min-width: $bp-large) {
      flex: 0 1 calc(50% - 2rem);
      margin-bottom: 4rem;
    }

    @media (min-width: $bp-extralarge) {
      flex: 0 1 50%;
      padding: 0 2rem;
    }

    @media (min-width: $bp-xxxl) {
      padding: 0 4rem;
    }

    @media (min-width: $bp-4k) {
      margin-bottom: 8rem;
    }

    &.column {
      max-width: $max-card-width;

      @media (min-width: $bp-large) {
        flex: 0 1 calc(33% - 2rem);
        padding: 0 2rem;
      }

      @media (min-width: $bp-4k) {
        max-width: none;
      }
    }

    .image-wrapper {
      width: 100%;
      flex: 0 0 100%;
      max-width: 80px;
      margin-bottom: 0.75rem;

      @media (min-width: $bp-large) {
        flex: 0 0 80px;
      }

      @media (min-width: $bp-4k) {
        flex: 0 0 calc(1.5 * 80px);
        max-width: calc(1.5 * 80px);
        margin-bottom: 1.5rem;
      }

      img {
        width: 100%;
      }
    }

    .text-wrapper {
      max-width: 650px;

      @media (min-width: $bp-4k) {
        margin-bottom: 2rem !important;
        max-width: $max-text-column-width-landing-4k;
      }
    }

    h3.title {
      font-size: $font-size-medium;
      margin-bottom: 0.5rem;

      @media (min-width: $bp-4k) {
        font-size: 2.5rem;
        margin-bottom: 1rem;
      }
    }

    .text {
      font-weight: 500;
      color: $mediumgrey;

      ::v-deep p:last-child {
        margin-bottom: 0;
      }
    }
  }
</style>

<docs lang="md">
  ```jsx
    import '@europeana/style/scss/landing.scss';
    <LandingInfoCard
      :card="{
        __typename: 'InfoCard',
        name: 'Title for an info card',
        text: 'This text contains info. It can be __marked__ and accompanied by an image',
        image: {
          url: 'https://images.ctfassets.net/i01duvb6kq77/1DxiDhy46cX5eBheNYFdP7/42518b79959f2ea5cd270f9cffa022b2/homepage_A_v4_blackline.svg',
          contentType: 'image/svg+xml', description: '', width: 111, height: 111
        }
    }"
    />
  ```
  Column card layout (for when card group contains cards with links)
  ```jsx
    import '@europeana/style/scss/landing.scss';
    <LandingInfoCard
      :card="{
        __typename: 'InfoCard',
        name: 'Title for an info card',
        text: 'This text contains info. It can be __marked__ and accompanied by an image',
        image: {
          url: 'https://images.ctfassets.net/i01duvb6kq77/1DxiDhy46cX5eBheNYFdP7/42518b79959f2ea5cd270f9cffa022b2/homepage_A_v4_blackline.svg',
          contentType: 'image/svg+xml', description: '', width: 111, height: 111
        },
        link: {
          url: '/',
          text: 'Read more link'
        }
    }"
    :column-card="true"
    />
  ```
</docs>
