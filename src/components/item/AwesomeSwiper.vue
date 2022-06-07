<template>
  <div
    class="swiper-outer"
  >
    <div
      v-show="ready"
      class="swiper"
      data-qa="awesome swiper"
    >
      <div
        class="swiper-wrapper"
      >
        <div
          v-for="(item, index) in displayableMedia"
          :key="index"
          class="swiper-slide"
        >
          <div
            v-if="singleMediaResource"
            class="container h-100"
          >
            <MediaCard
              :europeana-identifier="europeanaIdentifier"
              :media="item"
              :is-single-playable-media="isSinglePlayableMedia"
              :lazy="false"
            />
          </div>
          <MediaCard
            v-else
            :europeana-identifier="europeanaIdentifier"
            :media="item"
            :is-single-playable-media="isSinglePlayableMedia"
            :lazy="index > 0"
          />
        </div>
        <div
          class="swiper-button-prev"
        />
        <div
          class="swiper-button-next"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import { isPlayableMedia } from '@/plugins/media';

  import MediaCard from './MediaCard';

  export default {
    name: 'AwesomeSwiper',
    components: {
      MediaCard
    },
    props: {
      europeanaIdentifier: {
        type: String,
        required: true
      },
      displayableMedia: {
        type: Array,
        required: true
      }
    },
    data() {
      const singleMediaResource = this.displayableMedia.length === 1;
      return {
        swiperOptions: {
          init: true,
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
          },
          on: {
            afterInit: this.onAfterInit,
            slideChange: this.onSlideChange,
            slideChangeTransitionEnd: this.updateSwiper
          }
        },
        singleMediaResource,
        ready: singleMediaResource,
        swiper: null
      };
    },
    computed: {
      isSinglePlayableMedia() {
        return this.displayableMedia.filter(resource => isPlayableMedia(resource)).length === 1;
      }
    },
    mounted() {
      if (window.Swiper) {
        this.swiper = new window.Swiper('.swiper', this.swiperOptions);
      }
    },
    methods: {
      onAfterInit() {
        this.ready = true;
      },
      onSlideChange() {
        this.$emit('select', this.displayableMedia[this.swiper.activeIndex].about);
      },
      updateSwiper() {
        this.swiper.update();
      }
    }
  };
</script>

<style lang="scss">
  @import '@/assets/scss/variables';

  .swiper-outer,
  .swiper-container {
    height: $swiper-height;

    @media (max-height: $bp-medium) {
      max-height: $swiper-height;
    }

    @media (min-height: $bp-medium) {
      max-height: $swiper-height-max;
    }

    @media (max-width: $bp-medium) {
      max-height: $swiper-height-medium;
      height: $swiper-height-medium;
    }

    .swiper-slide {
      width: 100%;
      min-width: 16rem;

      @media (min-width: $bp-medium) {
        width: auto;
      }

      &::before {
        content: '';
        transition: $standard-transition;
      }

      &:not(.swiper-slide-active) {
        &::before {
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
    }

    .swiper-button-prev,
    .swiper-button-next {
      color: $lightgrey;
      background: $white;
      border-radius: 50%;
      width: 45px;
      opacity: 0.7;
    }

    .swiper-button-prev::after,
    .swiper-button-next::after {
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
