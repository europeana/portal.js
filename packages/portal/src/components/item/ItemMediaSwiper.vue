<template>
  <div
    class="swiper-outer d-flex flex-column flex-lg-row"
  >
    <div
      class="swiper swiper-container"
      data-qa="awesome swiper"
    >
      <div
        v-show="swiperReady"
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
      v-if="displayableMedia.length > 1"
      class=" d-flex flex-column position-relative"
    >
      <div class="swiper-thumbnails-toolbar d-flex align-items-center justify-content-center px-3 py-2 py-lg-1">
        <b-button
          variant="light-flat"
          class="swiper-button-prev icon-arrow-outline mr-2"
        />
        <b-button
          variant="light-flat"
          class="swiper-button-next icon-arrow-outline mr-2"
        />
        <span class="swiper-pagination d-inline-flex" />
      </div>
      <div class="swiper-thumbnails d-flex flex-row flex-lg-column">
        <ItemMediaSwiperThumbnail
          v-for="(media, index) in displayableMedia"
          :key="index"
          :media="media"
          :index="index"
          :edm-type="edmType"
          :lazy="index > 3"
          :class="{ 'swiper-slide-active': index === swiper?.activeIndex }"
          @click="swiper.slideTo(index)"
        />
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

  .swiper-outer {
    @media (min-width: $bp-large) {
      height: $swiper-height;

      @media (min-height: $bp-medium) {
        max-height: $swiper-height-max;
      }
    }
  }

  .swiper-container {
    @include swiper-height(0px);
    flex: 1 1 100%;
    width: 100%;
    background-color: $black;

    .swiper-wrapper {
      @include swiper-height(0px);
      transition: none;
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
  }

  .swiper-thumbnails {
    padding: 1rem;
    flex: 1 1 auto;
    background-color: $white;
    overflow-x: scroll;
    scrollbar-width: thin;

    @media (min-width: $bp-large) {
      overflow-x: hidden;
      overflow-y: auto;
      width: 13rem;
    }
  }

  .swiper-thumbnails-toolbar {
    background-color: rgba($black, 0.05);
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;

    @media (min-width: $bp-large) {
      background-color: rgba($white, 0.95);
      position: absolute;
    }

    .swiper-button-prev {
      transform: rotateY(180deg);
    }

    .swiper-button-prev,
    .swiper-button-next {
      background-color: transparent;
      color: $black;
      position: static;
      width: 1.5rem;
      height: 1.5rem;
      margin-top: auto;

      &:before {
        font-size: 1.5rem;
      }

      &::after {
        content: none;
      }

      &:hover {
        color: $blue;
      }
    }

    .swiper-pagination {
      position: static;
      transform: none;
      color: $mediumgrey-light;
      width: auto;
      font-size: $font-size-small;
    }

  }
</style>
