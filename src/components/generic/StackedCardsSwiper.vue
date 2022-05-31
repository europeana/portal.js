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
            v-if="slide.title"
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
            explore
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
      this.swiper.slideTo(this.slides.length / 2);
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
