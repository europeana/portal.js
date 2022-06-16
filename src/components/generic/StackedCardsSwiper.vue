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
    >
      {{ cta }}
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
            :style="slide.imageCSSVars"
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

  export default {
    name: 'StackedCardsSwiper',

    mixins: [swiperMixin],

    props: {
      title: {
        type: String,
        default: null
      },
      cta: {
        type: String,
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
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  .stacked-cards-wrapper {
    font-size: 1rem;
    text-align: center;

    @media (min-width: $bp-extraextralarge) {
      font-size: 1vw;
    }
  }

  .heading {
    color: $mediumgrey;
    font-size: 2em;

    @media (min-width: $bp-extraextralarge) {
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

    @media (min-width: $bp-extraextralarge) {
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

    --overlay: linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6));

    .card {
      border: 0;
      background-image: var(--overlay), var(--bg-img-small);
      background-size: cover;
      background-repeat: no-repeat;

      @media (min-width: $bp-small) {
        background-image: var(--overlay), var(--bg-img-medium, var(--bg-img-small));
      }

      @media (min-width: $bp-medium) {
        background-image: var(--overlay), var(--bg-img-large, var(--bg-img-small));
      }

      @media (min-width: $bp-large) {
        background-image: var(--overlay), var(--bg-img-xl, var(--bg-img-small));
      }

      @media (min-width: $bp-extralarge) {
        background-image: var(--overlay), var(--bg-img-xxl, var(--bg-img-small));
      }

      @media (min-width: $bp-extraextralarge) {
        background-image: var(--overlay), var(--bg-img-xxlup, var(--bg-img-small));
      }
    }

    .card-body {
      color: $white;
      @media (min-width: $bp-extraextralarge) {
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
    imageCSSVars: { '--bg-img-small': `url('https://api.europeana.eu/thumbnail/v2/url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Fwww.rijksmuseum.nl%2Fassetimage2.jsp%3Fid%3DSK-C-214')` }
  },
  {
    title: 'Archaeology',
    description: 'Explore all facets of archaeology from European museums, galleries, libraries and archives.',
    url: '/en/collections/topic/80-archaeology',
    imageCSSVars: { '--bg-img-small': `url('https://api.europeana.eu/thumbnail/v2/url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Fwww.rijksmuseum.nl%2Fassetimage2.jsp%3Fid%3DSK-C-214')` }
  },
  {
    title: 'Art',
    description: 'Discover inspiring art, artists and stories in the digitised collections of European museums, galleries, libraries and archives. Explore paintings, \
    drawings, engravings and sculpture from cultural heritage institutions across Europe.',
    url: '/en/collections/topic/190-art',
    imageCSSVars: { '--bg-img-small': `url('https://api.europeana.eu/thumbnail/v2/url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Fwww.rijksmuseum.nl%2Fassetimage2.jsp%3Fid%3DSK-C-214')` }
  },
  {
    title: 'Fashion',
    description: 'Explore fashion – historical clothing and accessories, contemporary designs, catwalk photographs, drawings, sketches, plates, catalogues and videos \
    – from more than 30 European public and private institutions.',
    url: '/en/collections/topic/55-fashion',
    imageCSSVars: { '--bg-img-small': `url('https://api.europeana.eu/thumbnail/v2/url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Fwww.rijksmuseum.nl%2Fassetimage2.jsp%3Fid%3DSK-C-214')` }
  },
  {
    title: 'Industrial Heritage',
    description: 'Explore Europe\'s industrial heritage through the digitised collections of European cultural heritage organisations and personal stories of our working lives.',
    url: '/en/collections/topic/129-industrial-heritage',
    imageCSSVars: { '--bg-img-small': `url('https://api.europeana.eu/thumbnail/v2/url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Fwww.rijksmuseum.nl%2Fassetimage2.jsp%3Fid%3DSK-C-214')` }
  },
  {
    title: 'Manuscripts',
    description: 'Explore the roots of European written culture through manuscripts from antiquity to the early print era. ',
    url: '/en/collections/topic/17-manuscripts',
    imageCSSVars: { '--bg-img-small': `url('https://api.europeana.eu/thumbnail/v2/url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Fwww.rijksmuseum.nl%2Fassetimage2.jsp%3Fid%3DSK-C-214')` }
  },
  {
    title: 'Maps and Geography',
    description: 'Explore history, geography and cartography through the digitised collections of European cultural heritage institutions.',
    url: '/en/collections/topic/151-maps-and-geography',
    imageCSSVars: { '--bg-img-small': `url('https://api.europeana.eu/thumbnail/v2/url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Fwww.rijksmuseum.nl%2Fassetimage2.jsp%3Fid%3DSK-C-214')` }
  },
  {
    title: 'Migration',
    description: 'Collections on the theme of migration to, from and within Europe, sourced from cultural heritage institutions and members of the public',
    url: '/en/collections/topic/128-migration',
    imageCSSVars: { '--bg-img-small': `url('https://api.europeana.eu/thumbnail/v2/url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Fwww.rijksmuseum.nl%2Fassetimage2.jsp%3Fid%3DSK-C-214')` }
  },
  {
    title: 'Music',
    description: 'Explore recordings, sheet music, instruments and music-related collections from European audio-visual archives, libraries and museums.',
    url: '/en/collections/topic/62-music',
    imageCSSVars: { '--bg-img-small': `url('https://api.europeana.eu/thumbnail/v2/url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Fwww.rijksmuseum.nl%2Fassetimage2.jsp%3Fid%3DSK-C-214')` }
  },
  {
    title: 'Natural history',
    description: 'Natural history is the research and study of organisms including plants or animals in their environment. Explore the world\'s natural history in drawings, \
    specimens and collections from European cultural heritage institutions.',
    url: '/en/collections/topic/156-natural-history',
    imageCSSVars: { '--bg-img-small': `url('https://api.europeana.eu/thumbnail/v2/url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Fwww.rijksmuseum.nl%2Fassetimage2.jsp%3Fid%3DSK-C-214')` }
  },
  {
    title: 'Newspapers',
    description: 'Explore the headlines, articles, advertisements, and opinion pieces from European newspapers from 20 countries, dating from 1618 to the 1980s.',
    url: '/en/collections/topic/18-newspapers',
    imageCSSVars: { '--bg-img-small': `url('https://api.europeana.eu/thumbnail/v2/url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Fwww.rijksmuseum.nl%2Fassetimage2.jsp%3Fid%3DSK-C-214')` }
  },
  {
    title: 'Photography',
    description: 'Discover inspiring images and the history of photography through the collections of European cultural heritage institutions.',
    url: '/en/collections/topic/48-photography',
    imageCSSVars: { '--bg-img-small': `url('https://api.europeana.eu/thumbnail/v2/url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Fwww.rijksmuseum.nl%2Fassetimage2.jsp%3Fid%3DSK-C-214')` }
  },
  {
    title: 'Sport',
    description: 'Explore sporting heritage and culture in photographs, films, sound recordings and texts from European collections.',
    url: '/en/collections/topic/114-sport',
    imageCSSVars: { '--bg-img-small': `url('https://api.europeana.eu/thumbnail/v2/url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Fwww.rijksmuseum.nl%2Fassetimage2.jsp%3Fid%3DSK-C-214')` }
  }
  ]" />
  ```
</docs>
