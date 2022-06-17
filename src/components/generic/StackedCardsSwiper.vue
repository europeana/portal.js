<template>
  <div class="stacked-cards-wrapper">
    <h2
      v-if="title"
      class="heading text-center my-3 mx-1"
    >
      {{ title }}
    </h2>
    <b-button
      v-if="cta"
      variant="outline-secondary"
      class="cta my-4"
      :to="cta.url"
    >
      {{ cta.text }}
    </b-button>
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
          class="swiper-slide"
        >
          <b-card
            class="h-100 text-center"
            body-class="py-4 d-flex flex-column align-items-center"
            :style="slide.image && imageCSSVars(slide.image)"
          >
            <b-card-title
              title-tag="h3"
            >
              <span>
                {{ slide.title }}
              </span>
            </b-card-title>
            <b-card-text
              text-tag="div"
              class="my-4"
            >
              <p class="mb-0">
                {{ slide.description }}
              </p>
            </b-card-text>
            <span class="line pb-4" />
            <b-button
              variant="outline-overlay"
              :to="slide.url"
              class="slide-link swiper-no-swiping"
              @focus="swiper.slideTo(i)"
            >
              {{ $t('explore') }}
            </b-button>
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import swiperMixin from '@/mixins/swiper';
  import { EffectCoverflow, Keyboard } from 'swiper';
  import { urlIsContentfulAsset, optimisedSrcForContentfulAsset } from '@/plugins/contentful-utils';

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
          modules: [EffectCoverflow, Keyboard],
          effect: 'coverflow',
          grabCursor: true,
          centeredSlides: true,
          slidesPerView: 'auto',
          slideToClickedSlide: true,
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
          keyboard: true,
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
        }
      };
    },

    mounted() {
      const middleCardIndex = Math.floor(this.slides.length / 2);
      this.swiper.slideTo(middleCardIndex);
    },

    methods: {
      imageCSSVars(image) {
        if (urlIsContentfulAsset(image.url)) {
          return {
            '--bg-img-small': `url('${optimisedSrcForContentfulAsset(image, { w: 245, h: 440, fit: 'fill' })}')`,
            '--bg-img-medium': `url('${optimisedSrcForContentfulAsset(image, { w: 260, h: 420, fit: 'fill' })}')`,
            '--bg-img-large': `url('${optimisedSrcForContentfulAsset(image, { w: 280, h: 400, fit: 'fill' })}')`,
            '--bg-img-xl': `url('${optimisedSrcForContentfulAsset(image, { w: 300, h: 400, fit: 'fill' })}')`,
            '--bg-img-xxl': `url('${optimisedSrcForContentfulAsset(image, { w: 320, h: 370, fit: 'fill' })}')`,
            '--bg-img-xxxl': `url('${optimisedSrcForContentfulAsset(image, { w: 355, h: 345, fit: 'fill' })}')`,
            '--bg-img-huge': `url('${optimisedSrcForContentfulAsset(image, { w: 510, h: 540, fit: 'fill' })}')`,
            '--bg-img-4k': `url('${optimisedSrcForContentfulAsset(image, { w: 700, h: 900, fit: 'fill' })}')`
          };
        } else {
          return {
            '--bg-img-small': `url('${image.url}')`
          };
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  .stacked-cards-wrapper {
    font-size: 1rem;
    text-align: center;

    @media (min-width: $bp-xxxl) {
      font-size: 1vw;
    }
  }

  .heading {
    color: $mediumgrey;
    font-size: 2em;

    @media (min-width: $bp-xxxl) {
      margin: 0.5em 0 !important;
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
    padding: 1rem 0 3rem;
  }

  .swiper-slide {
    width: calc(200px + 8vw);
    max-width: 720px;
    height: auto;

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

    --overlay: linear-gradient(0deg, rgba(0 0 0 / 60%), rgba(0 0 0 / 60%));

    .card {
      border: 0;
      background-size: cover;
      background-repeat: no-repeat;

      @media (max-width: $bp-small) {
        background-image: var(--overlay), var(--bg-img-small);
      }

      @media (min-width: $bp-small) and (max-width: $bp-medium) {
        background-image: var(--overlay), var(--bg-img-medium, var(--bg-img-small));
      }

      @media (min-width: $bp-medium) and (max-width: $bp-large) {
        background-image: var(--overlay), var(--bg-img-large, var(--bg-img-small));
      }

      @media (min-width: $bp-large) and (max-width: $bp-extralarge) {
        background-image: var(--overlay), var(--bg-img-xl, var(--bg-img-small));
      }

      @media (min-width: $bp-extralarge) and (max-width: $bp-xxl) {
        background-image: var(--overlay), var(--bg-img-xxl, var(--bg-img-small));
      }

      @media (min-width: $bp-xxl) and (max-width: $bp-xxxl) {
        background-image: var(--overlay), var(--bg-img-xxxl, var(--bg-img-small));
      }

      @media (min-width: $bp-xxxl) and (max-width: $bp-huge) {
        background-image: var(--overlay), var(--bg-img-huge, var(--bg-img-small));
      }

      @media (min-width: $bp-huge + 1px) {
        background-image: var(--overlay), var(--bg-img-4k, var(--bg-img-small));
      }
    }

    .card-body {
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
