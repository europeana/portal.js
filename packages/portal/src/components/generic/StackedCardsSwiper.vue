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
            class="card-body h-100 py-4 d-flex flex-column align-items-center position-relative"
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
              {{ $t('explore') }}
            </b-button>
          </div>
        </div>
      </div>
    </div>
    <b-button
      v-if="cta"
      variant="outline-secondary"
      class="cta"
      :to="cta.url"
    >
      {{ cta.text }}
    </b-button>
  </div>
</template>

<script>
  import swiperMixin from '@/mixins/swiper';
  import { EffectCoverflow, Lazy } from 'swiper';

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
          modules: [EffectCoverflow, Lazy],
          effect: 'coverflow',
          grabCursor: true,
          centeredSlides: true,
          slidesPerView: 'auto',
          slideToClickedSlide: true,
          preloadImages: false,
          lazy: {
            enabled: true,
            checkInView: true,
            loadPrevNext: true,
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
            afterInit: this.swiperOnAfterInit
          }
        },
        imageSizes: [
          '(max-width: 576px) 245px',
          '(max-width: 768px) 260px',
          '(max-width: 992px) 280px',
          '(max-width: 1200px) 300px',
          '(max-width: 1440px) 320px',
          '(max-width: 1920px) 355px',
          '(max-width: 2560px) 510px',
          '700px'
        ].join(',')
      };
    },

    mounted() {
      const middleCardIndex = Math.floor(this.slides.length / 2);
      this.swiper.slideTo(middleCardIndex);
    },

    methods: {
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
        return this.$contentful.assets.responsiveImageSrcset(image,
                                                             {
                                                               small: { w: 245, h: 440, fit: 'fill' },
                                                               medium: { w: 260, h: 420, fit: 'fill' },
                                                               large: { w: 280, h: 400, fit: 'fill' },
                                                               xl: { w: 300, h: 400, fit: 'fill' },
                                                               xxl: { w: 320, h: 370, fit: 'fill' },
                                                               xxxl: { w: 355, h: 345, fit: 'fill' },
                                                               wqhd: { w: 510, h: 540, fit: 'fill' },
                                                               '4k': { w: 700, h: 900, fit: 'fill' }
                                                             });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';
  @import '@/assets/scss/swiper';

  .stacked-cards-wrapper {
    font-size: 1rem;
    text-align: center;

    @media (min-width: $bp-xxxl) {
      font-size: 1vw;
    }
  }

  .heading {
    color: $mediumgrey;
    font-size: 2rem;

    @media (min-width: $bp-extralarge) {
      font-size: 2.375rem;
    }

    @media (min-width: $bp-xxxl) {
      margin: 0.5em 0 !important;
      font-size: 2em;
    }
  }

  .cta {
    font-size: 1em;
  }

  .slide-link {
    margin: auto 0 0;
    font-size: 1em;
    padding: 0.375em 0.75em;
  }

  .swiper-container {
    width: 100%;
    padding: 0;
    margin-top: 2.25rem;
    margin-bottom: 2.25rem;

    @media (min-width: $bp-xxxl) {
      margin-top: 2.25vw;
      margin-bottom: 2.25vw;
    }
  }

  .swiper-slide {
    width: calc(200px + 8vw);
    max-width: 720px;
    height: auto;
    overflow: hidden;

    @media (min-width: $bp-xxxl) {
      width: calc(200px + 12vw);
    }

    h3 {
      font-size: 1.25em;
      font-weight: 500;
      text-transform: uppercase;
    }

    p {
      font-size: 1em;
    }

    .card-body {
      background: linear-gradient(0deg, rgba(0 0 0 / 60%), rgba(0 0 0 / 60%));
      color: $white;

      @media (min-width: $bp-xxxl) {
        padding: 1.5em 1.25em !important;
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
    title: 'World War I',
    description: 'Collection of untold stories and official histories of World War I, in a unique blend of cultural heritage collections and personal items contributed by \
    European citizens.',
    url: '/en/collections/topic/83-world-war-i',
    image: { url: 'https://api.europeana.eu/thumbnail/v2/url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Fwww.rijksmuseum.nl%2Fassetimage2.jsp%3Fid%3DSK-C-214' }
  },
  {
    title: 'Archaeology',
    description: 'Explore all facets of archaeology from European museums, galleries, libraries and archives.',
    url: '/en/collections/topic/80-archaeology',
    image: { url: 'https://api.europeana.eu/thumbnail/v2/url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Fwww.rijksmuseum.nl%2Fassetimage2.jsp%3Fid%3DSK-C-214' }
  },
  {
    title: 'Art',
    description: 'Discover inspiring art, artists and stories in the digitised collections of European museums, galleries, libraries and archives. Explore paintings, \
    drawings, engravings and sculpture from cultural heritage institutions across Europe.',
    url: '/en/collections/topic/190-art',
    image: { url: 'https://api.europeana.eu/thumbnail/v2/url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Fwww.rijksmuseum.nl%2Fassetimage2.jsp%3Fid%3DSK-C-214' }
  },
  {
    title: 'Fashion',
    description: 'Explore fashion – historical clothing and accessories, contemporary designs, catwalk photographs, drawings, sketches, plates, catalogues and videos \
    – from more than 30 European public and private institutions.',
    url: '/en/collections/topic/55-fashion',
    image: { url: 'https://api.europeana.eu/thumbnail/v2/url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Fwww.rijksmuseum.nl%2Fassetimage2.jsp%3Fid%3DSK-C-214' }
  },
  {
    title: 'Industrial Heritage',
    description: 'Explore Europe\'s industrial heritage through the digitised collections of European cultural heritage organisations and personal stories of our working lives.',
    url: '/en/collections/topic/129-industrial-heritage',
    image: { url: 'https://api.europeana.eu/thumbnail/v2/url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Fwww.rijksmuseum.nl%2Fassetimage2.jsp%3Fid%3DSK-C-214' }
  },
  {
    title: 'Manuscripts',
    description: 'Explore the roots of European written culture through manuscripts from antiquity to the early print era. ',
    url: '/en/collections/topic/17-manuscripts',
    image: { url: 'https://api.europeana.eu/thumbnail/v2/url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Fwww.rijksmuseum.nl%2Fassetimage2.jsp%3Fid%3DSK-C-214' }
  },
  {
    title: 'Maps and Geography',
    description: 'Explore history, geography and cartography through the digitised collections of European cultural heritage institutions.',
    url: '/en/collections/topic/151-maps-and-geography',
    image: { url: 'https://api.europeana.eu/thumbnail/v2/url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Fwww.rijksmuseum.nl%2Fassetimage2.jsp%3Fid%3DSK-C-214' }
  },
  {
    title: 'Migration',
    description: 'Collections on the theme of migration to, from and within Europe, sourced from cultural heritage institutions and members of the public',
    url: '/en/collections/topic/128-migration',
    image: { url: 'https://api.europeana.eu/thumbnail/v2/url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Fwww.rijksmuseum.nl%2Fassetimage2.jsp%3Fid%3DSK-C-214' }
  },
  {
    title: 'Music',
    description: 'Explore recordings, sheet music, instruments and music-related collections from European audio-visual archives, libraries and museums.',
    url: '/en/collections/topic/62-music',
    image: { url: 'https://api.europeana.eu/thumbnail/v2/url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Fwww.rijksmuseum.nl%2Fassetimage2.jsp%3Fid%3DSK-C-214' }
  },
  {
    title: 'Natural history',
    description: 'Natural history is the research and study of organisms including plants or animals in their environment. Explore the world\'s natural history in drawings, \
    specimens and collections from European cultural heritage institutions.',
    url: '/en/collections/topic/156-natural-history',
    image: { url: 'https://api.europeana.eu/thumbnail/v2/url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Fwww.rijksmuseum.nl%2Fassetimage2.jsp%3Fid%3DSK-C-214' }
  },
  {
    title: 'Newspapers',
    description: 'Explore the headlines, articles, advertisements, and opinion pieces from European newspapers from 20 countries, dating from 1618 to the 1980s.',
    url: '/en/collections/topic/18-newspapers',
    image: { url: 'https://api.europeana.eu/thumbnail/v2/url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Fwww.rijksmuseum.nl%2Fassetimage2.jsp%3Fid%3DSK-C-214' }
  },
  {
    title: 'Photography',
    description: 'Discover inspiring images and the history of photography through the collections of European cultural heritage institutions.',
    url: '/en/collections/topic/48-photography',
    image: { url: 'https://api.europeana.eu/thumbnail/v2/url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Fwww.rijksmuseum.nl%2Fassetimage2.jsp%3Fid%3DSK-C-214' }
  },
  {
    title: 'Sport',
    description: 'Explore sporting heritage and culture in photographs, films, sound recordings and texts from European collections.',
    url: '/en/collections/topic/114-sport',
    image: { url: 'https://api.europeana.eu/thumbnail/v2/url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Fwww.rijksmuseum.nl%2Fassetimage2.jsp%3Fid%3DSK-C-214' }
  }
  ]" />
  ```
</docs>
