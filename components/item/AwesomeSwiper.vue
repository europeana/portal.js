<template>
  <swiper
    ref="awesome"
    class="swiper"
    :options="swiperOptions"
    @slide-change="onSlideChange"
    @slide-change-transition-end="updateSwiper"
  >
    <swiper-slide
      v-for="(item, index) in displayableMedia"
      :key="index"
    >
      <MediaCard
        :europeana-identifier="europeanaIdentifier"
        :media="item"
      />
    </swiper-slide>
    <div
      slot="pagination"
      class="swiper-pagination"
    />
    <div
      slot="button-prev"
      class="swiper-button-prev"
    />
    <div
      slot="button-next"
      class="swiper-button-next"
    />
  </swiper>
</template>

<script>
  import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
  import 'swiper/css/swiper.css';
  import { isIIIFPresentation } from '../../plugins/media';
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
          slidesPerView: 'auto',
          spaceBetween: 40,
          centeredSlides: true,
          slideToClickedSlide: true,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          }
        }
      };
    },
    computed: {
      swiper() {
        return this.$refs.awesome.$swiper;
      },
      displayableMedia() {
        // Quick check for IIIF content, which is to prevent newspapers from showing many IIIF viewers.
        return isIIIFPresentation(this.media[0]) ? [this.media[0]] : this.media;
      }
    },
    methods: {
      onSlideChange() {
        this.$emit('select', this.media[this.swiper.activeIndex].about);
      },
      updateSwiper() {
        this.swiper.update();
      }
    }
  };
</script>

<style lang="scss">
  @import './assets/scss/variables.scss';

  .swiper-container {
    max-height: 568px;
    height: 80vh;
  }
  .swiper-slide {
    width: auto;
    :before {
      content: '';
      transition: $standard-transition;
    }
    &:not(.swiper-slide-active):before {
      content: '';
      width: 100%;
      left: 0;
      top: 0;
      height: 100%;
      position: absolute;
    }
    &:only-child {
      width: 100%;
    }
    a {
      display: inline-flex;
      height: 100%;
      align-items: center;
    }
  }
  .swiper-button-prev, .swiper-button-next {
    color: $lightgrey;
    background: $white;
    border-radius: 50%;
    width: 45px;
    opacity: 0.7;
  }
  .swiper-button-prev:after, .swiper-button-next:after {
    font-size: 22px;
  }
  .swiper-pagination-bullet-active {
    background: $smoke;
  }
</style>
