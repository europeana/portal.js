<template>
  <div
    class="swiper-outer d-flex flex-column flex-lg-row"
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
    </div>
    <div
      v-if="!singleMediaResource"
      class="swiper-thumbnails-wrapper"
    >
      <div class="swiper-thumbnails d-flex flex-row flex-lg-column">
        <!-- Should the slides be buttons? -->
        <div
          v-for="(item, index) in displayableMedia"
          :key="index"
          class="swiper-slide-thumbnail"
          @click="swiper.slideTo(index)"
        >
          <ItemMediaSwiperThumbnail
            :media="item"
            :edm-type="edmType"
            :offset="displayableMedia.length > 1 ? index : null"
            :lazy="index > 3"
          />
          <span class="swiper-slide-thumbnail-page">{{ `p. ${index + 1}` }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import swiperMixin from '@/mixins/swiper';
  import MediaCard from '../media/MediaCard';
  import WebResource from '@/plugins/europeana/edm/WebResource';
  import { A11y, Navigation, Pagination } from 'swiper/modules';

  export default {
    name: 'ItemMediaSwiper',

    components: {
      ItemMediaSwiperThumbnail: () => import('@/components/item/ItemMediaSwiperThumbnail'),
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
          modules: [A11y, Navigation, Pagination],
          init: true,
          threshold: singleMediaResource ? 5000000 :  null,
          slidesPerView: 1,
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
      },
      swiperOnAfterInit() {
        this.swiperReady = true;
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
    flex: 0 1 100%;
    width: 100%;
    background: black;

    .swiper .swiper-slide {
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

  .swiper-thumbnails-wrapper {
    flex: 1 0 auto;
    background-color: $white;
    overflow-x: scroll;
    scrollbar-width: thin;

    @media (min-width: $bp-large) {
      overflow-x: hidden;
      overflow-y: auto;
    }

    .swiper-thumbnails {
      padding: 1rem;
      width: 13rem;
    }

    .swiper-slide-thumbnail {
      background-color: $grey;
      padding: 0;
      flex-shrink: 0;
      width: 11rem;
      height: 7.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      margin-right: 1rem;
      position: relative;;

      @media (min-width: $bp-large) {
        margin-bottom: 1rem;
      }

      &:last-child {
        margin-right: 0;

        @media (min-width: $bp-large) {
          margin-bottom: 0;
        }
      }

      &::after {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        right:0;
        bottom: 0;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.70) 100%);
      }
    }

    .swiper-slide-thumbnail-page {
      position: absolute;
      bottom: 1rem;
      left: 1rem;
      color: $white;
      font-size: 0.75rem;
      z-index: 1;
    }
  }
</style>
