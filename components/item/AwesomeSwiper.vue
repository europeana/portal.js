<template>
    <swiper ref="awesome" :options="swiperOptions">
        <swiper-slide>
            <img src="https://api.europeana.eu/api/v2/thumbnail-by-url.json?type=IMAGE&amp;uri=http%3A%2F%2Frepos.europeanafashion.eu%2Fpaulvanriel%2F54332959.jpg" alt="">
        </swiper-slide>
        <swiper-slide>
            <img src="https://api.europeana.eu/api/v2/thumbnail-by-url.json?type=IMAGE&amp;uri=http%3A%2F%2Fdata.jck.nl%2Fthumbnail%2Fjck%2Fjoods-historisch%2Fd616%2F616NM009292%2F500" alt="">
        </swiper-slide>
        <swiper-slide>
          <img data-v-370eeff7="" src="https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Fwww.filmportal.de%2Fsites%2Fdefault%2Ffiles%2F4103B2B7BD864968B6F915EFF9F2410B_1-003838.jpg" alt="">
        </swiper-slide>
        <div class="swiper-button-prev" slot="button-prev"></div>
        <div class="swiper-button-next" slot="button-next"></div>
    </swiper>
</template>

<script>
  import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
  import 'swiper/swiper-bundle.css'

  export default {
    name: 'AwesomeSwiper',
    components: {
        Swiper,
        SwiperSlide
    },
    data() {
      return {
        swiperOptions: {
          slidesPerView: 2,
          spaceBetween: 20,
          centeredSlides: true,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
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
    width: 60%;
    /* img {
      height: 100%;
      width: 100%;
      object-fit: contain;
    } */
  }
  .swiper-slide:nth-child(2n) {
    width: 40%;
  }
  .swiper-slide:nth-child(3n) {
    width: 20%;
  }
  .swiper-container {
    max-width: 700px;
    height: 568px;
  }
  .swiper-button-prev, .swiper-button-next {
    color: #999;
  }
</style>