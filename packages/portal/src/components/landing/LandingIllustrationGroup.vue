<template>
  <b-container
    class="landing-illustration-group"
    :class="variant"
  >
    <b-col class="header col-lg-8 text-center mx-auto px-0 pb-4 pb-lg-5">
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
                :image-srcset="imageSrcset(slide.image)"
                :image-sizes="imageSizes"
                :alt="slide.name || ''"
                class="swiper-lazy"
              />
            </component>
          </div>
        </div>
      </div>
      <div
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
  import { Grid, Keyboard, Lazy, Navigation, Pagination } from 'swiper';

  const SRCSET_PRESETS = {
    small: { w: 98, h: 98 },
    large: { w: 127, h: 127 },
    '4k': { w: 340, h: 340 }
  };

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
        imageSizes: [
          '(max-width: 991px) 98px',
          '(max-width: 3019px) 127px',
          '340px'
        ].join(','),

        swiperOptions: {
          modules: [Grid, Keyboard, Lazy, Navigation, Pagination],
          grid: {
            fill: 'row',
            rows: 2
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          },
          pagination: {
            bulletElement: 'button',
            clickable: true,
            el: '.swiper-pagination',
            type: 'bullets'
          },
          slidesPerGroup: 2,
          slidesPerView: 2,
          preloadImages: false,
          lazy: {
            enabled: true,
            checkInView: true
          },
          breakpoints: {
            768: {
              grid: {
                rows: 1
              },
              slidesPerGroup: 4,
              slidesPerView: 4
            }
          },
          keyboard: {
            enabled: true,
            pageUpDown: false
          },
          on: {
            afterInit: this.swiperOnAfterInit,
            activeIndexChange: this.setFocusOnActiveSlideLink
          }
        }
      };
    },

    methods: {
      imageSrcset(image) {
        return this.$contentful.assets.responsiveImageSrcset(image, SRCSET_PRESETS);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .container {
    padding-top: 3rem;
    padding-bottom: 3rem;

    @media (min-width: $bp-medium) {
      padding-top: 6rem;
      padding-bottom: 8rem;
    }

    @media (min-width: $bp-4k) {
      padding-top: 12rem;
      padding-bottom: 12rem;
    }
  }
  .header {
    @media (min-width: $bp-xxl) {
      max-width: $max-text-column-width;
    }

    h2 {
      font-family: $font-family-ubuntu;
      font-size: $font-size-large;
      font-weight: 500;
      margin-bottom: 0.5rem;

      @media (min-width: $bp-medium) {
        font-size: $font-size-xl;
        margin-bottom: 1rem;
      }

      @media (min-width: $bp-4k) {
        font-size: $font-size-xl-4k;
      }
    }

    h3 {
      font-family: $font-family-ubuntu;
      font-size: $font-size-medium;
      font-weight: 500;

      @media (min-width: $bp-medium) {
        font-size: 1.75rem;
        margin-bottom: 1rem;
      }

      @media (min-width: $bp-4k) {
        font-size: calc(1.5 * 1.75rem);
      }
    }

    .text {
      color: $mediumgrey;
    }
  }

  .swiper-container-wrapper {
    margin: 0 auto;
    position: relative;

    @media (min-width: $bp-medium) {
      width: 100%;
    }

    @media (min-width: $bp-large) {
      width: 873px;
    }

  }
  .swiper-container {
    width: 100%;

    @media (min-width: $bp-medium) {
      width: calc(100% - 101px);
    }

    @media (min-width: $bp-large) {
      width: 671px;
    }
    .image-wrapper {
      width: 98px;
      height: 98px;
      display: inline-flex;
      align-items: center;
      justify-content: center;

      @media (min-width: $bp-large) {
        width: 127px;
        height: 127px;
      }

      @media (min-width: $bp-4k) {
        width: calc(1.5 * 127px);
        height: calc(1.5 * 127px);
      }

      img {
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
</style>

<!-- Only DS4CH styles after this line! -->
<style lang="scss" scoped>
  @import '@europeana/style/scss/DS4CH/style';
  @import '@europeana/style/scss/responsive-background-image';
  .landing-illustration-group.ds4ch {

    .swiper-container-wrapper {
      @media (min-width: $bp-4k) {
        width: 2810px;
      }
    }
    .swiper-container {
      @media (min-width: $bp-4k) {
        width: 2272px;
      }
      .image-wrapper {
        @media (min-width: $bp-4k) {
          width: 340px;
          height: 340px;
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
