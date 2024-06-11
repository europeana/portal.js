<template>
  <ContentCard
    :title="featuredStory.name"
    :texts="[featuredStory.headline]"
    :url="contentfulEntryUrl(featuredStory)"
    :image-url="featuredStory.image && featuredStory.image.url"
    :image-content-type="featuredStory.image && featuredStory.image.contentType"
    :image-width="featuredStory.image && featuredStory.image.width"
    :image-height="featuredStory.image && featuredStory.image.height"
    :lazy="false"
    class="featured-story-card"
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

  min-height: 0;
  margin-bottom: 3rem;

  ::v-deep .card-img {
    position: absolute;
    border-radius: $border-radius-small;
    min-height: 0;
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
    max-height: 13rem;
    flex: 0 1 auto;
    z-index: 2;
    padding: 2rem;

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
    }
  }
}
</style>
