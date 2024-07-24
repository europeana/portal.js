<template>
  <!-- swiperComponentClasses should be set outside the swiper component to not interfer with Swiper.js class handling -->
  <div
    class="stacked-cards-wrapper"
    :class="swiperComponentClasses"
  >
    <h2
      v-if="title"
      class="heading text-center mt-3 mb-0 mx-1"
    >
      {{ title }}
    </h2>
    <div
      v-show="swiperReady"
      ref="swiper"
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
            <b-button
              ref="slideLink"
              variant="primary"
              :to="slide.url"
              class="slide-link swiper-no-swiping mb-3"
              :data-qa="`slide link ${i}`"
              @focus="swiper.slideTo(i)"
            >
              {{ slide.title }}
            </b-button>
            <div
              class="slide-description mb-3"
            >
              <p class="mb-0">
                {{ slide.description }}
              </p>
            </div>
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
            activeIndexChange: this.setFocusOnActiveSlideLink,
            touchStart: (swiper, event) => {
              this.setSwiperComponentClasses(event);
            },
            touchEnd: (swiper, event) => {
              this.setSwiperComponentClasses(event);
            }
          }
        },
        swiperComponentClasses: 'show-swiper-slide-content-hover',
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

      this.$refs.swiper.addEventListener('keyup', (event) => {
        this.setSwiperComponentClasses(event);
      });
      this.$refs.swiper.addEventListener('keydown', (event) => {
        this.setSwiperComponentClasses(event);
      });
    },

    beforeDestroy() {
      this.$refs.swiper.removeEventListener('keyup', (event) => {
        this.setSwiperComponentClasses(event);
      });
      this.$refs.swiper.removeEventListener('keydown', (event) => {
        this.setSwiperComponentClasses(event);
      });
    },

    methods: {
      setFocusOnActiveSlideLink() {
        this.$refs.slideLink[this.swiper.activeIndex].focus();
      },
      setSwiperComponentClasses(event) {
        const keyboardNavigationKeyCodes = [9, 37, 39];
        const activeKeyboardNavigation = keyboardNavigationKeyCodes.includes(event.keyCode);

        if (['pointerup', 'touchend'].includes(event.type) || (activeKeyboardNavigation && event.type === 'keyup')) {
          this.swiperComponentClasses = 'show-swiper-slide-content';
        } else if (['pointerdown', 'touchstart'].includes(event.type) || (activeKeyboardNavigation && event.type === 'keydown')) {
          this.swiperComponentClasses = '';
        }
      },
      imageSrc(image) {
        if (image?.url && this.$contentful.assets.isValidUrl(image.url)) {
          return this.$contentful.assets.optimisedSrc(image, { w: 245, h: 440, fit: 'fill' });
        } else if (image?.url) {
          return image.url;
        } else {
          return null;
        }
      },
      imageSrcset(image) {
        return this.$contentful.assets.responsiveImageSrcset(image, SRCSET_PRESETS);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/swiper';

  $slide-height: 385px;
  $slide-height-4k: 500px;

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
    padding: 0 0.5rem;
    font-size: $font-size-medium;
    font-weight: 500;

    @media (min-width: $bp-4k) {
      font-size: $font-size-medium-4k;
      padding: 0 0.75rem;
    }

    &:focus {
      outline: none;
      box-shadow: none;
    }

    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
    }
  }

  .swiper-container {
    height: calc($slide-height + (2 * 2.25rem));
    width: 100%;
    padding: 0;

    @media (min-width: $bp-4k) {
      height: calc($slide-height-4k + (3 * 2.25rem));
    }
  }

  .swiper-wrapper {
    // Firefox fix where left outer slides become unclickable due to wrapper overflow and Firefox handling transform and z-index combination differently
    height: 0;
    width: 0;
    overflow: visible;
  }

  .swiper-slide {
    width: 245px;
    height: $slide-height;
    max-width: $max-card-width;
    overflow: visible;
    border-radius: $border-radius-small;
    opacity: 0;
    margin-top: 2.25rem;
    margin-bottom: 2.25rem;

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
      height: $slide-height-4k;
      margin-top: calc(1.5 * 2.25rem);
      margin-bottom: calc(1.5 * 2.25rem);
    }

    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
      opacity: 0;
      background-image: linear-gradient(to top, rgb(0, 0, 0) 2%, rgba(0, 0, 0, 0.75) 50%, rgba(0, 0, 0, 0) 75%);
      border-radius: $border-radius-small;
      transition: opacity 900ms ease-out, transform 400ms ease-out;
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 2;
    }

    &.swiper-slide-active::after {
      content: none;
    }

    &.swiper-slide-visible {
      opacity: 1;
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
      color: $white;
      padding-top: 1.5rem;
      padding-bottom: 0;
      transition: background-image 400ms ease-out;
      z-index: 2;

      @media (min-width: $bp-4k) {
        padding-top: calc(1.5 * 1.5rem);
      }
    }

    .slide-description {
      opacity: 0;
      max-height: 0;
      transition: max-height 400ms ease-out, opacity 500ms ease-out;
    }

    .image-overlay {
      height: 100%;
      width: 100%;
      object-fit: cover;
      left: -50%;
      right: -50%;
      margin: 0 auto;
      border-radius: $border-radius-small;
      transition: transform 400ms ease-out;
    }
  }

  .show-swiper-slide-content .swiper-slide-active,
  .show-swiper-slide-content-hover .swiper-slide-active:hover {
    .image-overlay {
      transform: scale(1.05);
      transition: transform 400ms ease-out;
    }

    &:before {
      opacity: 1;
      transform: scale(1.05);
      transition: opacity 400ms ease-out, transform 400ms ease-out;
    }

    .slide-description {
      opacity: 1;
      max-height: 100%;
      transition: max-height 1000ms ease-out, opacity 600ms ease-out;
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
