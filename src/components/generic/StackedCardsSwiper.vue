<template>
  <div>
    <swiper
      ref="swiper"
      :options="swiperOptions"
    >
      <swiper-slide
        v-for="(slide, i) in slides"
        :key="i"
        :index="i"
      >
        <b-card
          class="h-100 text-center"
          body-class="py-4 d-flex flex-column align-items-center"
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
            class="mt-4 mb-5"
          >
            <p>
              {{ slide.description }}
            </p>
          </b-card-text>
          <b-button
            variant="outline-primary"
            :href="slide.url"
            class="slide-link"
          >
            {{ $t('explore') }}
          </b-button>
        </b-card>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
  import { Swiper as SwiperClass, EffectCoverflow, Keyboard } from 'swiper/core';
  import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter';
  SwiperClass.use([EffectCoverflow, Keyboard]);
  const { Swiper, SwiperSlide } = getAwesomeSwiper(SwiperClass);

  import 'swiper/swiper-bundle.css';

  export default {
    name: 'StackedCardsSwiper',

    components: {
      Swiper,
      SwiperSlide
    },

    props: {
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
          }
        }
      };
    },

    computed: {
      swiper() {
        return this.$refs.swiper.$swiper;
      }
    },

    mounted() {
      this.swiper && this.swiper.slideTo(this.slides.length / 2);
    }
  };
</script>

<style lang="scss" scoped>
.slide-link {
  margin: auto 0 0;
}

.swiper-container {
  width: 100%;
  padding: 3rem 0;
}

.swiper-slide {
  width: calc(200px + 12vmin);
  height: auto;
}
</style>

<docs lang="md">
  ```jsx
  <StackedCardsSwiper :slides="[
  {
    title: 'World War I',
    description: 'Collection of untold stories and official histories of World War I, in a unique blend of cultural heritage collections and personal items contributed by European citizens.',
    url: '/en/collections/topic/83-world-war-i'
  },
  {
    title: 'Archaeology',
    description: 'Explore all facets of archaeology from European museums, galleries, libraries and archives.',
    url: '/en/collections/topic/80-archaeology'
  },
  {
    title: 'Art',
    description: 'Discover inspiring art, artists and stories in the digitised collections of European museums, galleries, libraries and archives. Explore paintings, drawings, engravings and sculpture from cultural heritage institutions across Europe.',
    url: '/en/collections/topic/190-art'
  },
  {
    title: 'Fashion',
    description: 'Explore fashion – historical clothing and accessories, contemporary designs, catwalk photographs, drawings, sketches, plates, catalogues and videos – from more than 30 European public and private institutions.',
    url: '/en/collections/topic/55-fashion'
  },
  {
    title: 'Industrial Heritage',
    description: 'Explore Europe\'s industrial heritage through the digitised collections of European cultural heritage organisations and personal stories of our working lives.',
    url: '/en/collections/topic/129-industrial-heritage'
  },
  {
    title: 'Manuscripts',
    description: 'Explore the roots of European written culture through manuscripts from antiquity to the early print era. ',
    url: '/en/collections/topic/17-manuscripts'
  },
  {
    title: 'Maps and Geography',
    description: 'Explore history, geography and cartography through the digitised collections of European cultural heritage institutions.',
    url: '/en/collections/topic/151-maps-and-geography'
  },
  {
    title: 'Migration',
    description: 'Collections on the theme of migration to, from and within Europe, sourced from cultural heritage institutions and members of the public',
    url: '/en/collections/topic/128-migration'
  },
  {
    title: 'Music',
    description: 'Explore recordings, sheet music, instruments and music-related collections from European audio-visual archives, libraries and museums.',
    url: '/en/collections/topic/62-music'
  },
  {
    title: 'Natural history',
    description: 'Natural history is the research and study of organisms including plants or animals in their environment. Explore the world\'s natural history in drawings, specimens and collections from European cultural heritage institutions.',
    url: '/en/collections/topic/156-natural-history'
  },
  {
    title: 'Newspapers',
    description: 'Explore the headlines, articles, advertisements, and opinion pieces from European newspapers from 20 countries, dating from 1618 to the 1980s.',
    url: '/en/collections/topic/18-newspapers'
  },
  {
    title: 'Photography',
    description: 'Discover inspiring images and the history of photography through the collections of European cultural heritage institutions.',
    url: '/en/collections/topic/48-photography'
  },
  {
    title: 'Sport',
    description: 'Explore sporting heritage and culture in photographs, films, sound recordings and texts from European collections.',
    url: '/en/collections/topic/114-sport'
  }
  ]" />
  ```
</docs>
