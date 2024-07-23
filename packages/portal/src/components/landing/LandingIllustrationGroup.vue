<template>
  <b-container
    class="landing-illustration-group"
    :class="variant"
  >
    <b-col class="header col-lg-8 text-center mx-auto px-0">
      <component :is="titleTag">
        {{ title }}
      </component>
      <!-- eslint-disable vue/no-v-html -->
      <div
        v-if="text"
        class="text mb-3"
        v-html="parseMarkdownHtml(text)"
      />
    <!-- eslint-enable vue/no-v-html -->
    </b-col>
    <div
      class="swiper-container-wrapper"
      :class="{ 'paginated': illustrations.length > 4 }"
    >
      <div
        v-show="swiperReady"
        class="swiper swiper-container"
      >
        <div
          class="swiper-wrapper"
        >
          <div
            v-for="(slide, i) in illustrations"
            :key="i"
            :index="i"
            class="swiper-slide text-center"
          >
            <component
              :is="slide.url ? 'SmartLink' : 'div'"
              :destination="slide.url"
              class="image-wrapper"
            >
              <ImageOptimised
                :src="slide.image.url"
                :contentful-image-crop-presets="SRCSET_PRESETS"
                :image-sizes="imageSizes"
                :width="slide.image.width"
                :height="slide.image.height"
                :alt="slide.name || ''"
                class="swiper-lazy"
              />
            </component>
          </div>
        </div>
      </div>
      <div
        v-if="illustrations.length > 4"
        class="swiper-pagination"
      />
      <div
        v-show="illustrations.length > 4"
        class="swiper-button-prev"
      />
      <div
        v-show="illustrations.length > 4"
        class="swiper-button-next"
      />
    </div>
  </b-container>
</template>

<script>
  import ImageOptimised from '@/components/image/ImageOptimised';
  import parseMarkdownHtmlMixin from '@/mixins/parseMarkdownHtml';
  import swiperMixin from '@/mixins/swiper';
  import { Grid, Keyboard, Navigation, Pagination } from 'swiper/modules';

  export default {
    name: 'LandingIllustrationGroup',

    components: {
      ImageOptimised,
      SmartLink: () => import('@/components/generic/SmartLink')
    },

    mixins: [parseMarkdownHtmlMixin, swiperMixin],

    props: {
      /**
       * Heading title to display above the illustrations
       */
      title: {
        type: String,
        default: null
      },
      /**
       * Heading title level to use. Override default for when used in subsection to keep correct heading structure.
       */
      titleTag: {
        type: String,
        default: 'h2'
      },
      /**
       * Text to display under title and above the illustrations
       */
      text: {
        type: String,
        default: null
      },
      /**
       * List of illustrations
       */
      illustrations: {
        type: Array,
        default: () => []
      },
      /**
       * Variant to define layout and style
       * @values pro, ds4ch
       */
      variant: {
        type: String,
        default: 'pro'
      }
    },

    data() {
      return {
        SRCSET_PRESETS: {
          large: { w: 98, h: 98 },
          '4k': { w: 127, h: 127 },
          '4k+': { w: 340, h: 340 }
        },

        imageSizes: [
          '(max-width: 991px) 98px', // bp-large
          '(max-width: 3019px) 127px', // bp-4k
          '340px'
        ].join(','),

        swiperOptions: {
          modules: [Grid, Keyboard, Navigation, Pagination],
          centerInsufficientSlides: true,
          grid: {
            fill: 'row',
            rows: 2
          },
          lazyPreloadPrevNext: 4,
          slidesPerGroup: 2,
          slidesPerView: 2,
          speed: 600,
          breakpoints: {
            768: {
              grid: {
                rows: 1
              },
              slidesPerGroup: 4,
              slidesPerView: 4
            },
            3020: {
              grid: {
                rows: 1
              },
              slidesPerGroup: 5,
              slidesPerView: 5
            }
          }
        }
      };
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .container {
    margin-top: 3rem;
    margin-bottom: 3rem;
    padding-left: 0;
    padding-right: 0;

    @media (min-width: $bp-large) {
      margin-top: 6rem;
      margin-bottom: 6rem;
    }

    @media (min-width: $bp-4k) {
      margin-top: 15rem;
      margin-bottom: 15rem;
    }
  }
  .header {
    padding-bottom: 1rem;

    @media (min-width: $bp-xxl) {
      max-width: $max-text-column-width;
    }

    .text {
      color: $mediumgrey;
    }
  }

  $swiper-slide-width-height: 98px;
  $swiper-slide-width-height-large: 127px;
  $swiper-slide-width-height-4k: calc(2 * $swiper-slide-width-height-large);
  $swiper-pagination-height: 56.5px;
  $swiper-pagination-height-large: 88.5px;
  $swiper-pagination-height-4k: 124px;

  .swiper-container-wrapper {
    margin: 0 auto;
    position: relative;
    height: calc(2 * $swiper-slide-width-height); // Set a fixed height to prevent layout shift

    &.paginated {
      height: calc((2 * $swiper-slide-width-height) + $swiper-pagination-height);
    }

    @media (min-width: $bp-medium) {
      width: 100%;
      height: $swiper-slide-width-height;

      &.paginated {
        height: calc($swiper-slide-width-height + $swiper-pagination-height);
      }
    }

    @media (min-width: $bp-large) {
      width: 873px;
      height: $swiper-slide-width-height-large;

      &.paginated {
        height: calc($swiper-slide-width-height-large + $swiper-pagination-height-large);
      }
    }

    @media (min-width: $bp-4k) {
      width: 100%;
      height: $swiper-slide-width-height-4k;

      &.paginated {
        height: calc($swiper-slide-width-height-4k + $swiper-pagination-height-4k);
      }
    }

  }

  .swiper-container {
    width: 100%;

    @media (min-width: $bp-medium) {
      width: calc(100% - 101px);
    }

    .image-wrapper {
      width: $swiper-slide-width-height;
      height: $swiper-slide-width-height;
      display: inline-flex;
      align-items: center;
      justify-content: center;

      @media (min-width: $bp-large) {
        width: $swiper-slide-width-height-large;
        height: $swiper-slide-width-height-large;
      }

      @media (min-width: $bp-4k) {
        width: $swiper-slide-width-height-4k;
        height: $swiper-slide-width-height-4k;
      }

      ::v-deep picture {
        width: 100%;
        height: 100%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      ::v-deep img {
        mix-blend-mode: multiply; // fixes logo img with white background
        max-height: 100%;

      }

      ::v-deep .icon-external-link {
        display: none;
      }
    }
  }

  .swiper-button-prev,
  .swiper-button-next {
    display: none;
    height: 48px;
    width: 48px;
    color: $black;
    background: $bodygrey;
    border-radius: 50%;
    top: calc(50% - 2rem);

    @media (min-width: $bp-medium) {
      display: flex;
    }

    @media (min-width: $bp-large) {
      top: calc(50% - 3rem);
    }

    &:after {
      font-size: 1.25rem;
      font-weight: 700;
    }

    @media (min-width: $bp-4k) {
      height: 96px;
      width: 96px;
      top: calc(50% - 5rem);

      &:after {
        font-size: 2.5rem;
      }
    }
  }

  .swiper-button-prev::after {
    padding-right: 2px;
  }

  .swiper-button-next::after {
    padding-left: 2px;
  }

  .swiper-pagination {
    width: 100%;
    margin-top: 2rem;
    position: relative;

    @media (min-width: $bp-large) {
      margin-top: 4rem;
    }
  }

  ::v-deep .swiper-pagination-bullet {
    height: 12px;
    width: 12px;
    color: $black;
    background-color: transparent;
    border: 2px solid $black;
    opacity: 1;
    margin-right: 6px;

    @media (min-width: $bp-4k) {
      height: 24px;
      width: 24px;
      margin-right: 12px;
      border-width: 4px;
    }

    &:hover {
      cursor: pointer;
    }

    &:last-child {
      margin-right: 0;
    }

    &-active {
      background-color: $black;
    }
  }

  .landing-illustration-group.pro {
    .swiper-slide {
      background-color: $bodygrey; // Set a background color for mix-blend-mode to work properly
    }

    .swiper-button-prev,
    .swiper-button-next {
      background: $white;
    }
  }
</style>

<!-- Only DS4CH styles after this line! -->
<style lang="scss" scoped>
  @import '@europeana/style/scss/DS4CH/variables';
  @import '@europeana/style/scss/responsive-background-image';
  .landing-illustration-group.ds4ch {
    @media (min-width: $bp-4k) {
      margin-top: 15rem;
      margin-bottom: 15rem;
    }

    .header {
      @media (min-width: $bp-4k) {
        max-width: $max-text-column-width-landing-4k !important;
        padding-bottom: 5rem;
      }
    }

    h2 {
      @media (min-width: $bp-4k) {
        margin-bottom: 2rem;
      }
    }

    .text {
      color: $black;

      @media (min-width: $bp-4k) {
        font-size: 2.5rem;
        margin-bottom: 3.125rem;
      }
    }

    $swiper-slide-width-height-ds4ch-4k: 340px;
    $swiper-pagination-height-ds4ch-4k: 126px;

    .swiper-container-wrapper {
      @media (min-width: $bp-4k) {
        height: $swiper-slide-width-height-ds4ch-4k;

        &.paginated {
          height: calc($swiper-slide-width-height-ds4ch-4k + $swiper-pagination-height-ds4ch-4k);
        }
      }
    }
    .swiper-container {

      .image-wrapper {
        @media (min-width: $bp-4k) {
          width: $swiper-slide-width-height-ds4ch-4k;
          height: $swiper-slide-width-height-ds4ch-4k;
        }
      }
    }

    .swiper-button-prev,
    .swiper-button-next {
      @media (min-width: $bp-4k) {
        height: 128px;
        width: 128px;

        &:after {
          font-size: 3.5rem;
        }
      }
    }

    .swiper-pagination {
      @media (min-width: $bp-4k) {
        margin-top: 4rem;
      }
    }

    ::v-deep .swiper-pagination-bullet {
      border: 2px solid $black;

      @media (min-width: $bp-4k) {
        height: 32px;
        width: 32px;
        border: 4px solid $black;
        margin-right: 12px;

        &:last-child {
          margin-right: 0;
        }
      }

      &-active {
        background-color: $black;
      }
    }
  }
</style>
