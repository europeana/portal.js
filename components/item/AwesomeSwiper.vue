<template>
    <swiper ref="awesome" :options="swiperOptions">
        <swiper-slide v-for="(item, index) in media" :key="index">
            <MediaCard
              :europeana-identifier="item.europeanaIdentifier"
              :image-src="item.about"
            />
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
        <div class="swiper-button-prev" slot="button-prev"></div>
        <div class="swiper-button-next" slot="button-next"></div>
    </swiper>
</template>

<script>
  import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
  import 'swiper/swiper-bundle.css'
  import MediaCard from './MediaCard';

  export default {
    name: 'AwesomeSwiper',
    components: {
        Swiper,
        SwiperSlide,
        MediaCard
    },
    props: {
      europeanaIdentifier: {
        type: String,
        required: true
      },
      media: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        swiperOptions: {
          slidesPerView: 3,
          spaceBetween: 40,
          centeredSlides: true,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          }
        }
      }
    },
    computed: {
      swiper() {
        return this.$refs.awesome.$swiper
      }
    },
    mounted() {
      // console.log('Current Swiper instance object', this.swiper)
      // this.swiper.slideTo(3, 1000, false)
    }
  };
</script>

<style lang="scss" scoped>
  .swiper-slide {
    /* width: 60%; */
    img {
      max-height: 100%;
      /* width: 100%;
      object-fit: contain; */
    }
  }
  /* .swiper-slide:nth-child(2n) {
    width: 40%;
  }
  .swiper-slide:nth-child(3n) {
    width: 20%;
  } */
  .swiper-container {
    /* max-width: 1024px; */
    height: 568px;
  }
  .swiper-button-prev, .swiper-button-next {
    color: #999;
    background: #fff;
    border-radius: 50%;
    width: 45px;
    opacity: 0.7;
  }
  .swiper-button-prev:after, .swiper-button-next:after {
    font-size: 22px;
  }
</style>