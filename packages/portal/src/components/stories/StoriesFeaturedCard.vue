<template>
  <ContentCard
    :title="featuredStory.name"
    :texts="[featuredStory.headline]"
    :url="contentfulEntryUrl(featuredStory)"
    :image-url="featuredStory.primaryImageOfPage?.image?.url"
    :image-content-type="featuredStory.primaryImageOfPage?.image?.contentType"
    :image-sizes="imageSizes"
    :contentful-image-crop-presets="imageCropPresets"
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

    data() {
      return {
        imageCropPresets: {
          small: { w: 545, h: 288, fit: 'fill', f: 'face' },
          medium: { w: 510, h: 288, fit: 'fill', f: 'face' },
          large: { w: 345, h: 288, fit: 'fill', f: 'face' },
          xl: { w: 465, h: 288, fit: 'fill', f: 'face' },
          xxl: { w: 555, h: 320, fit: 'fill', f: 'face' },
          xxxl: { w: 805, h: 320, fit: 'fill', f: 'face' },
          wqhd: { w: 1005, h: 480, fit: 'fill', f: 'face' },
          '4k': { w: 1255, h: 480, fit: 'fill', f: 'face' },
          '4k+': { w: 1485, h: 578, fit: 'fill', f: 'face' }
        },
        imageSizes: [
          '(max-width: 575px) 545px', // bp-small
          '(max-width: 767px) 510px', // bp-medium
          '(max-width: 991px) 345px', // bp-large
          '(max-width: 1199px) 465px', // bp-xl
          '(max-width: 1399px) 555px', // bp-xxl
          '(max-width: 1879px) 805px', // bp-xxxl
          '(max-width: 2519px) 1005px', // bp-wqhd
          '(max-width: 3019px) 1255px', // bp-4k
          '1485px'
        ].join(',')
      };
    },

    methods: {
      contentfulEntryUrl
    }
  };
</script>

<style lang="scss" scoped>
@import '@europeana/style/scss/variables';

.featured-story-card {
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
    border-radius: $border-radius-small $border-radius-small 0 0;

    @media (min-width: $bp-medium) {
      flex: 0 0 50%;
      order: 1;
      max-height: none;
      position: relative;
      border-radius: 0 $border-radius-small $border-radius-small 0;

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

    @media (min-width: $bp-4k) {
      border-radius: 0 $border-radius-large $border-radius-large 0;
    }
  }

  ::v-deep .card-body {
    flex: 0 0 50%;
    padding: 2.625rem 1rem;
    background-color: $blue;
    border-radius: 0  0 $border-radius-small $border-radius-small;

    @media (min-width: $bp-medium) {
      order: 0;
      padding: 2.875rem 2rem;
      border-radius: $border-radius-small 0 0 $border-radius-small;
    }

    @media (min-width: $bp-large) {
      flex: 0 0 50%;
    }

    @media (min-width: $bp-4k) {
      padding: 8.75rem 6.5rem;
      border-radius: $border-radius-large 0 0 $border-radius-large;
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

      @media (min-width: $bp-xxxl) {
        font-size: calc(1.25 * $font-size-medium);
      }

      @media (min-width: $bp-4k) {
        font-size: $font-size-xl-4k;
      }

      a {
        color: $white;
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
