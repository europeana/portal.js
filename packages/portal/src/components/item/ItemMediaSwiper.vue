<template>
  <div
    class="swiper-outer"
  >
    <div
      v-show="swiperReady"
      class="swiper swiper-container"
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
              :offset="displayableMedia.length > 1 ? index : null"
              :edm-type="edmType"
            />
          </div>
          <MediaCard
            v-else
            :europeana-identifier="europeanaIdentifier"
            :media="item"
            :is-single-playable-media="isSinglePlayableMedia"
            :lazy="index > 0"
            :offset="displayableMedia.length > 1 ? index : null"
            :edm-type="edmType"
          />
        </div>
      </div>
      <div
        class="swiper-button-prev"
      />
      <div
        class="swiper-button-next"
      />
    </div>
  </div>
</template>

<script>
  import swiperMixin from '@/mixins/swiper';
  import MediaCard from '../media/MediaCard';
  import WebResource from '@/plugins/europeana/edm/WebResource';
  import { Pagination, Navigation } from 'swiper';

  export default {
    name: 'ItemMediaSwiper',

    components: {
      MediaCard
    },

    mixins: [swiperMixin],

    props: {
      europeanaIdentifier: {
        type: String,
        required: true
      },
      edmType: {
        type: String,
        default: null
      },
      displayableMedia: {
        type: Array,
        required: true,
        validator: (prop) => Array.isArray(prop) && prop.every((item) => item instanceof WebResource)
      }
    },

    data() {
      const singleMediaResource = this.displayableMedia.length === 1;
      return {
        swiperOptions: {
          modules: [Navigation, Pagination],
          init: true,
          threshold: singleMediaResource ? 5000000 :  null,
          spaceBetween: singleMediaResource ? null : 40,
          centeredSlides: true,
          slideToClickedSlide: true,
          pagination: {
            type: 'fraction'
          },
          on: {
            slideChange: this.onSlideChange,
            slideChangeTransitionEnd: this.updateSwiper
          }
        },
        singleMediaResource,
        swiperReady: singleMediaResource
      };
    },

    computed: {
      isSinglePlayableMedia() {
        return this.displayableMedia.filter(resource => resource.isPlayableMedia).length === 1;
      }
    },

    methods: {
      onSlideChange() {
        this.$emit('select', this.displayableMedia[this.swiper.activeIndex].about);
      },
      updateSwiper() {
        this.swiper.update();
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/mixins';
  @import '@europeana/style/scss/swiper';

  .swiper-outer,
  .swiper-container {
    @include swiper-height(0px);
    background-color: $black;

    .swiper-slide {
      width: 100%;
      min-width: 16rem;
      padding-top: 2.25rem;

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
