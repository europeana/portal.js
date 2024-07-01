<template>
  <ContentCard
    :title="featuredStory.name"
    :texts="[featuredStory.headline]"
    :url="contentfulEntryUrl(featuredStory)"
    :image-url="featuredStory.primaryImageOfPage?.image?.url"
    :image-content-type="featuredStory.primaryImageOfPage?.image?.contentType"
    :image-width="featuredStory.primaryImageOfPage?.image?.width"
    :image-height="featuredStory.primaryImageOfPage?.image?.height"
    :image-optimisation-options="{ width: 700, height: 320, fit: 'fill', focus: 'face' }"
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
  overflow: hidden;
  min-height: 10rem;

  @at-root .xxl-page .card-deck-4-cols & {
    flex: 0 1 100%;
    max-width: none;
    margin-bottom: 3rem;

    @media (min-width: $bp-4k) {
      margin-bottom: 4.5rem;
    }
  }

  ::v-deep .card-wrapper {
    @media (min-width: $bp-medium) {
      flex-direction: row;
    }

    @media (min-width: $bp-xxxl) {
      min-height: 20rem;
    }

    .default-thumbnail {
      aspect-ratio: 0;
    }
  }

  ::v-deep .card-img {
    @media (min-width: $bp-medium) {
      flex: 0 0 50%;
      order: 1;
      max-height: none;
      position: relative;
      border-radius: 0;

      img {
        height: 100%;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transition: transform 400ms linear;
      }
    }
  }

  ::v-deep .card-body {
    flex: 0 0 50%;
    padding: 2.625rem 1rem;
    background-color: $blue;

    @media (min-width: $bp-medium) {
      order: 0;
      padding: 2.875rem 2rem;
    }

    @media (min-width: $bp-large) {
      flex: 0 0 50%;
    }

    @media (min-width: $bp-4k) {
      padding: 8.75rem 6.5rem;
    }

    .card-title-texts-wrapper {
      @media (min-width: $bp-xxxl) {
        max-width: $max-text-column-width;
      }
    }

    .card-subtitle {
      background-color: $white;
      border-radius: $border-radius-small;
      color: $blue;
      padding: 0.3125rem 0.5rem;
      display: inline-block;
      margin-bottom: 1.375rem;

      @media (min-width: $bp-xxxl) {
        font-size: calc(1.25 * $font-size-extrasmall);
      }

      @media (min-width: $bp-4k) {
        border-radius: $border-radius-large;
        padding: calc(1.5 * 0.3125rem) 0.75rem;
        font-size: $font-size-extrasmall-4k;
      }
    }

    .card-title {
      font-family: $font-family-ubuntu;
      font-size: $font-size-medium;
      font-weight: 500;
      color: $white;
      display: inline-flex;
      flex-direction: column;
      -webkit-line-clamp: none;
      overflow: visible;

      @media (min-width: $bp-xxxl) {
        font-size: calc(1.25 * $font-size-medium);
      }

      @media (min-width: $bp-4k) {
        font-size: $font-size-xl-4k;
      }

      a {
        color: $white;

        span {
          background-image: linear-gradient(to right, $white 50%, transparent 50%);
          background-size: 201% 2px;
          background-position: bottom right;
          background-repeat: no-repeat;
          transition: background-position 400ms linear;
          padding-bottom: 4px;

          @media (min-width: $bp-4k) {
            background-size: 201% 4px;
            padding-bottom: 6px;
          }
        }
      }
    }

    .card-text {
      color: $white;
      font-size: $font-size-base;
      line-height: 1.5;

      @media (min-width: $bp-xxxl) {
        font-size: calc(1.25 * $font-size-base);
      }

      @media (min-width: $bp-4k) {
        font-size: $font-size-base-4k;
      }

      p {
        -webkit-line-clamp: 2;
      }
    }
  }

  &:hover {
    ::v-deep .card-img {
      img {
        transform: scale(1.05);
        transition: transform 400ms linear;
      }
    }

    ::v-deep .card-title a span {
      background-position: bottom left;
      transition: background-position 400ms linear;
    }
  }
}
</style>

<docs lang="md">
  ```jsx
    <StoriesFeaturedCard
      :featuredStory="{
        '__typename': 'Story',
        identifier: 'story-identifier',
        name: 'Story title',
        headline: 'Story subtitle with a bit more text.',
        image: imagesWithAttribution[0].image
      }"
    />
  ```
</docs>
