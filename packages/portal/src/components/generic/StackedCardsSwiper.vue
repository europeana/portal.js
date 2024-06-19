<template>
  <div class="stacked-cards-wrapper">
    <h2
      v-if="title"
      class="heading text-center my-3 mx-1"
    >
      {{ title }}
    </h2>
    <div
      v-show="swiperReady"
      class="swiper swiper-container"
    >
      <div
        class="swiper-wrapper"
      >
        <div
          v-for="(slide, i) in slides"
          :key="i"
          :index="i"
          class="swiper-slide text-center"
        >
          <img
            :data-src="imageSrc(slide.image)"
            :data-srcset="imageSrcset(slide.image)"
            :data-sizes="imageSizes"
            :alt="slide.image && slide.image.description || ''"
            class="image-overlay position-absolute swiper-lazy"
          >
          <div
            class="card-body h-100 d-flex flex-column align-items-center position-relative"
          >
            <h3>
              <span>
                {{ slide.title }}
              </span>
            </h3>
            <div
              class="my-4"
            >
              <p class="mb-0">
                {{ slide.description }}
              </p>
            </div>
            <span class="line pb-4" />
            <b-button
              ref="slideLink"
              variant="outline-overlay"
              :to="slide.url"
              class="slide-link swiper-no-swiping"
              :data-qa="`slide link ${i}`"
              @focus="swiper.slideTo(i)"
            >
              {{ $t('actions.explore') }}
            </b-button>
          </div>
        </div>
      </div>
    </div>
    <b-button
      v-if="cta"
      variant="outline-secondary"
      :to="cta.url"
    >
      {{ cta.text }}
    </b-button>
  </div>
</template>

<script>
  import swiperMixin from '@/mixins/swiper';
  import { EffectCoverflow, Keyboard, Lazy } from 'swiper';
  import { optimisedContentfulImageUrl, responsiveContentfulImageSrcset } from '@/utils/contentful/assets.js';

  const SRCSET_PRESETS = {
    small: { w: 245, h: 440, fit: 'fill' },
    medium: { w: 260, h: 420, fit: 'fill' },
    large: { w: 280, h: 400, fit: 'fill' },
    xl: { w: 300, h: 400, fit: 'fill' },
    xxl: { w: 320, h: 370, fit: 'fill' },
    '4k': { w: 355, h: 345, fit: 'fill' },
    '4k+': { w: 480, h: 470, fit: 'fill' }
  };

  export default {
    name: 'StackedCardsSwiper',

    mixins: [swiperMixin],

    props: {
      title: {
        type: String,
        default: null
      },
      cta: {
        type: Object,
        default: null
      },
      /**
       * Slides that each contain data for title, description and url
       */
      slides: {
        type: Array,
        required: true
      }
    },

    data() {
      return {
        swiperOptions: {
          modules: [EffectCoverflow, Keyboard, Lazy],
          effect: 'coverflow',
          grabCursor: true,
          centeredSlides: true,
          slideToClickedSlide: true,
          preloadImages: false,
          lazy: {
            loadPrevNextAmount: 10
          },
          breakpoints: {
            0: {
              spaceBetween: -150
            },
            576: {
              spaceBetween: -100
            },
            992: {
              spaceBetween: 0
            }
          },
          coverflowEffect: {
            rotate: 0,
            stretch: 100,
            depth: 200,
            modifier: 1,
            slideShadows: false,
            scale: 1
          },
          on: {
            activeIndexChange: this.setFocusOnActiveSlideLink
          }
        },
        imageSizes: [
          '(max-width: 575px) 245px', // bp-small
          '(max-width: 767px) 260px', // bp-medium
          '(max-width: 991px) 280px', // bp-large
          '(max-width: 1199px) 300px', // bp-xl
          '(max-width: 1399px) 320px', // bp-xxl
          '(max-width: 3019px) 355px', // bp-4k
          '480px'
        ].join(',')
      };
    },

    mounted() {
      const middleCardIndex = Math.floor(this.slides.length / 2);
      this.swiper.slideTo(middleCardIndex);
    },

    methods: {
      setFocusOnActiveSlideLink() {
        this.$refs.slideLink[this.swiper.activeIndex].focus();
      },
      imageSrc(image) {
        return optimisedContentfulImageUrl(
          image,
          { w: 245, h: 440, fit: 'fill' }
        );
      },
      imageSrcset(image) {
        return responsiveContentfulImageSrcset(image, SRCSET_PRESETS);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/swiper';

  .stacked-cards-wrapper {
    font-size: 1rem;
    text-align: center;

    @media (min-width: $bp-4k) {
      font-size: 1.5rem;
    }
  }

  .heading {
    color: $mediumgrey;
    font-size: 2rem;

    @media (min-width: $bp-extralarge) {
      font-size: $font-size-xxl;
    }

    @media (min-width: $bp-4k) {
      font-size: $font-size-xxl-4k;
    }
  }

  .slide-link {
    margin: auto 0 0;
    padding: 0.375em 0.75em;

    @media (min-width: $bp-4k) {
      font-size: 1.5rem;
      padding: calc(1.5 * 0.375em) calc(1.5 * 0.75em);
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(255 255 255 / 50%);
    }
  }

  .swiper-container {
    width: 100%;
    padding: 0;
    margin-top: 2.25rem;
    margin-bottom: 2.25rem;

    @media (min-width: $bp-4k) {
      margin-top: calc(1.5 * 2.25rem);
      margin-bottom: calc(1.5 * 2.25rem);
    }
  }

  .swiper-slide {
    width: 245px;
    max-width: $max-card-width;
    height: auto;
    overflow: hidden;

    @media (min-width: $bp-small) {
      width: 260px;
    }

    @media (min-width: $bp-medium) {
      width: 280px;
    }

    @media (min-width: $bp-large) {
      width: 300px;
    }

    @media (min-width: $bp-extralarge) {
      width: 320px;
    }

    @media (min-width: $bp-xxl) {
      width: 355px;
    }

    @media (min-width: $bp-4k) {
      width: 480px;
    }

    h3 {
      font-weight: 500;
      text-transform: uppercase;
    }

    p {
      @media (min-width: $bp-4k) {
        font-size: 1.5rem;
      }
    }

    .card-body {
      background: linear-gradient(0deg, rgba(0 0 0 / 60%), rgba(0 0 0 / 60%));
      color: $white;
      padding-top: 1.5rem;
      padding-bottom: 1.5rem;

      @media (min-width: $bp-4k) {
        padding-top: calc(1.5 * 1.5rem);
        padding-bottom: calc(1.5 * 1.5rem);
      }
    }

    .line {
      width: 40%;
      border-top: 1px solid $white;
      margin: auto;
    }

    .image-overlay {
      min-height: 100%;
      min-width: 100%;
      width: auto;
      max-width: none;
      left: -50%;
      right: -50%;
      margin: 0 auto;
    }
  }
</style>

<docs lang="md">
  ```jsx
  <StackedCardsSwiper
    title="Swiper title"
    :slides="[
    {
      title: 'Title slide 1',
      description: 'Collection of untold stories and official histories of World War I, in a unique blend of cultural heritage collections and personal items contributed by \
      European citizens.',
      url: '/',
      image: { url: thumbnails[0] }
    },
    {
      title: 'Title slide 2',
      description: 'Explore all facets of archaeology from European museums, galleries, libraries and archives.',
      url: '/',
      image: { url: thumbnails[1] }
    },
    {
      title: 'Title slide 3',
      description: 'Discover inspiring art, artists and stories in the digitised collections of European museums, galleries, libraries and archives. Explore paintings, \
      drawings, engravings and sculpture from cultural heritage institutions across Europe.',
      url: '/',
      image: { url: thumbnails[2] }
    },
    {
      title: 'Title slide 4',
      description: 'Explore fashion – historical clothing and accessories, contemporary designs, catwalk photographs, drawings, sketches, plates, catalogues and videos \
      – from more than 30 European public and private institutions.',
      url: '/',
      image: { url: thumbnails[3] }
    },
    {
      title: 'Title slide 5',
      description: 'Explore Europe\'s industrial heritage through the digitised collections of European cultural heritage organisations and personal stories of our working lives.',
      url: '/',
      image: { url: thumbnails[4] }
    },
    {
      title: 'Title slide 6',
      description: 'Explore the roots of European written culture through manuscripts from antiquity to the early print era. ',
      url: '/',
      image: { url: thumbnails[5] }
    },
    {
      title: 'Title slide 7',
      description: 'Explore history, geography and cartography through the digitised collections of European cultural heritage institutions.',
      url: '/',
      image: { url: thumbnails[6] }
    },
    {
      title: 'Title slide 8',
      description: 'Collections on the theme of migration to, from and within Europe, sourced from cultural heritage institutions and members of the public',
      url: '/',
      image: { url: thumbnails[7] }
    },
    {
      title: 'Title slide 9',
      description: 'Explore recordings, sheet music, instruments and music-related collections from European audio-visual archives, libraries and museums.',
      url: '/',
      image: { url: thumbnails[8] }
    },
    {
      title: 'Title slide 10',
      description: 'Natural history is the research and study of organisms including plants or animals in their environment. Explore the world\'s natural history in drawings, \
      specimens and collections from European cultural heritage institutions.',
      url: '/',
      image: { url: thumbnails[9] }
    },
    {
      title: 'Title slide 11',
      description: 'Explore the headlines, articles, advertisements, and opinion pieces from European newspapers from 20 countries, dating from 1618 to the 1980s.',
      url: '/',
      image: { url: thumbnails[10] }
    },
    {
      title: 'Title slide 12',
      description: 'Discover inspiring images and the history of photography through the collections of European cultural heritage institutions.',
      url: '/',
      image: { url: thumbnails[0] }
    },
    {
      title: 'Title slide 13',
      description: 'Explore sporting heritage and culture in photographs, films, sound recordings and texts from European collections.',
      url: '/',
      image: { url: thumbnails[1] }
    }
  ]" />
  ```
</docs>
