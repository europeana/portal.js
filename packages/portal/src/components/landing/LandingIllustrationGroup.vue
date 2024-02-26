<template>
  <b-container>
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
            <img
              :src="slide.image.url"
              :alt="slide.image && slide.image.description || ''"
              class="swiper-lazy"
            >
          </component>
        </div>
      </div>
      <div
        class="swiper-button-prev"
      />
      <div
        class="swiper-button-next"
      />
      <div
        class="swiper-pagination"
      />
    </div>
  </b-container>
</template>

<script>
  import parseMarkdownHtmlMixin from '@/mixins/parseMarkdownHtml';
  import swiperMixin from '@/mixins/swiper';
  import { Grid, Pagination, Navigation, Keyboard, Lazy } from 'swiper';

  export default {
    name: 'LandingIllustrationGroup',

    components: {
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
      }
    },

    data() {
      return {
        swiperOptions: {
          modules: [Grid, Pagination, Navigation, Keyboard, Lazy],
          grid: {
            fill: 'row',
            rows: 2
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          },
          pagination: {
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
            576: {
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
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

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
  }

  .text {
    color: $mediumgrey;
  }

  .swiper {
    --swiper-navigation-size: 24px;
    --swiper-navigation-sides-offset: 50px;
    --swiper-navigation-color: $black;
  }

  .swiper-slide {

    .image-wrapper {
      width: 98px;
      height: 98px;
      display: inline-block;

      img {
        mix-blend-mode: multiply; // fixes logo img with white background
        max-height: 100%;

      }

      ::v-deep .icon-external-link {
        display: none;
      }
    }
  }
</style>
