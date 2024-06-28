<template>
  <ContentCard
    :title="featuredStory.name"
    :texts="[featuredStory.headline]"
    :url="contentfulEntryUrl(featuredStory)"
    :image-url="featuredStory.image && featuredStory.image.url"
    :image-content-type="featuredStory.image && featuredStory.image.contentType"
    :lazy="false"
    class="featured-story-card"
    data-qa="featured story card"
  />
</template>

<script>
  import ContentCard from '@/components/content/ContentCard';
  import { contentfulEntryUrl } from '@/utils/contentful/entry-url.js';

  export default {
    name: 'StoriesFeaturedCard',

    components: {
      ContentCard
    },

    props: {
      featuredStory: {
        type: Object,
        required: true
      }
    },

    methods: {
      contentfulEntryUrl
    }
  };
</script>

<style lang="scss" scoped>
@import '@europeana/style/scss/variables';

.featured-story-card {
  @at-root .xxl-page .card-deck-4-cols & {
    flex: 0 1 100%;
    max-width: none;
  }

  min-height: 10rem;
  margin-bottom: 3rem;

  ::v-deep .card-wrapper {
    flex-direction: row;
  }

  ::v-deep .card-img {
    position: absolute;
    border-radius: $border-radius-small;
    min-height: 10rem;
    max-height: none;
    top: 0;
    bottom: 0;

    &::after {
      content: '';
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6));
      position: absolute;
      z-index: 1;
    }
  }

  ::v-deep .card-body {
    position: relative;
    flex: 0 1 auto;
    z-index: 2;
    padding: 2rem;

    @media (min-width: $bp-large) {
      flex: 0 0 50%;
    }

    @media (min-width: $bp-xxxl) {
      max-width: $max-text-column-width;
    }

    @media (min-width: $bp-4k) {
      padding: 3rem;
    }

    .card-subtitle {
      background-color: $blue;
      border-radius: $border-radius-small;
      color: $white;
      padding: 0.3125rem 0.5rem;
      display: inline-block;

      @media (min-width: $bp-4k) {
        border-radius: $border-radius-large;
        padding: calc(1.5 * 0.3125rem) 0.75rem;
      }
    }

    .card-title {
      font-family: $font-family-ubuntu;
      font-size: $font-size-medium;
      font-weight: 500;
      color: $white;
      display: block;
      -webkit-line-clamp: none;

      @media (min-width: $bp-4k) {
        font-size: $font-size-medium-4k;
      }

      a {
        color: $white;
      }
    }

    .card-text {
      color: $white;
      font-size: $font-size-base;
      line-height: 1.5;

      @media (min-width: $bp-4k) {
        font-size: $font-size-base-4k;
      }

      p {
        display: block;
        -webkit-line-clamp: none;
      }
    }
  }
}
</style>
