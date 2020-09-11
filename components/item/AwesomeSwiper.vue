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
      <div
        v-if="singleMediaResource"
        class="container h-100"
      >
        <MediaCard
          :europeana-identifier="europeanaIdentifier"
          :media="item"
          :is-single-playable-media="isSinglePlayableMedia"
        />
      </div>
      <MediaCard
        v-else
        :europeana-identifier="europeanaIdentifier"
        :media="item"
        :is-single-playable-media="isSinglePlayableMedia"
      />
    </swiper-slide>
    <div
      v-if="!singleMediaResource"
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
  // Custom build of Swiper with only the modules we need:
  // @see https://swiperjs.com/api/#custom-build
  // @see https://github.com/surmon-china/vue-awesome-swiper#custom-build-with-swiper
  import { Swiper as SwiperClass, Pagination, Navigation } from 'swiper/core';
  import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter';
  SwiperClass.use([Pagination, Navigation]);
  const { Swiper, SwiperSlide } = getAwesomeSwiper(SwiperClass);

  import 'swiper/swiper-bundle.css';
  import { isIIIFPresentation, isPlayableMedia } from '../../plugins/media';

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
      // Crude check for IIIF content, which is to prevent newspapers from showing many IIIF viewers.
      const displayableMedia = isIIIFPresentation(this.media[0]) ? [this.media[0]] : this.media;
      const singleMediaResource = displayableMedia.length === 1;
      return {
        displayableMedia,
        swiperOptions: {
          threshold: singleMediaResource ? 5000000 :  null,
          slidesPerView: 'auto',
          spaceBetween: singleMediaResource ? null : 40,
          centeredSlides: true,
          slideToClickedSlide: true,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
            type: 'fraction'
          }
        },
        singleMediaResource
      };
    },
    computed: {
      swiper() {
        return this.$refs.awesome.$swiper;
      },
      isSinglePlayableMedia() {
        return this.media.filter(resource => isPlayableMedia(resource)).length === 1;
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
    max-height: 40.5rem;
    height: 80vh;
    padding-bottom: 5rem;
    margin-bottom: -5rem;

    @media (max-width: $bp-medium) {
      max-height: 25rem;
    }

    .swiper-slide {
      width: auto;
      :before {
        content: '';
        transition: $standard-transition;
      }

      &:not(.swiper-slide-active) {
        &:before {
          content: '';
          width: 100%;
          left: 0;
          top: 0;
          height: 100%;
          position: absolute;
        }
        .audio-slide {
          pointer-events: none;
        }
      }

      &:only-child {
        width: 100%;
        margin-left: auto;
        margin-right: auto;
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

    .swiper-button-disabled {
      display: none;
    }

    .swiper-container-horizontal > .swiper-pagination-bullets {
      left: 50%;
      transform: translateX(-50%);
      width: auto;
    }

    .swiper-pagination-bullet-active {
      background: $smoke;
    }
  }
</style>
