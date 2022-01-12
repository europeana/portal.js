<template>
  <figure
    ref="container"
    class="compare-image-wrapper"
  >
    <div
      class="compare-image"
      data-qa="compare image"
    >
      <OptimisedImage
        ref="leftImage"
        :style="leftImageClip"
        :src="leftImageSrc"
        :width="leftImageWidth"
        :height="leftImageHeight"
        :content-type="leftImageContentType"
        :max-width="1100"
        :lazy="lazy"
        data-qa="compare image left image"
      />
      <OptimisedImage
        ref="rightImage"
        :src="rightImageSrc"
        :width="rightImageWidth"
        :height="rightImageHeight"
        :content-type="rightImageContentType"
        :max-width="1100"
        :lazy="lazy"
        data-qa="compare image right image"
      />
      <div
        ref="slider"
        class="slider"
        :style="sliderBarPosition"
        data-qa="compare image slider"
        @mousedown="initDrag"
        @touchstart="initDrag"
      >
        <span class="slider-bar" />
        <button
          :class="{ 'is-active' : dragging }"
          class="slider-handle"
          data-qa="compare image slider handler"
        >
          <span class="sr-only">{{ $t('imageSlider.handle') }}</span>
        </button>
      </div>
    </div>
    <figcaption>
      <CiteAttribution
        :name="leftImageAttribution.name"
        :creator="leftImageAttribution.creator"
        :provider="leftImageAttribution.provider"
        :rights-statement="leftImageAttribution.rightsStatement"
        :url="leftImageAttribution.url"
        :class="hideAttribution === 'left' && 'cite-hidden'"
        data-qa="compare image left attribution"
        :data-prefix="$t('directions.left')"
      />
      <CiteAttribution
        :name="rightImageAttribution.name"
        :creator="rightImageAttribution.creator"
        :provider="rightImageAttribution.provider"
        :rights-statement="rightImageAttribution.rightsStatement"
        :url="rightImageAttribution.url"
        :class="hideAttribution === 'right' && 'cite-hidden'"
        data-qa="compare image right attribution"
        :data-prefix="$t('directions.right')"
      />
    </figcaption>
  </figure>
</template>

<script>
  import CiteAttribution from './CiteAttribution';
  import OptimisedImage from './OptimisedImage';

  /**
   * Slider to compare two images side-by-side
   */
  export default {
    name: 'CompareImageSlider',

    components: {
      CiteAttribution,
      OptimisedImage
    },

    props: {
      /**
       * URL of the left image
       */
      leftImageSrc: {
        type: String,
        required: true
      },

      /**
       * Content type of the left image
       */
      leftImageContentType: {
        type: String,
        default: null
      },

      /**
       * Width of the left image
       */
      leftImageWidth: {
        type: Number,
        required: true
      },

      /**
       * Height of the left image
       */
      leftImageHeight: {
        type: Number,
        required: true
      },

      /**
       * Attribution for the left image
       *
       * Properties are passed as props to CiteAttribution
       */
      leftImageAttribution: {
        type: Object,
        required: true
      },

      /**
       * URL of the right image
       */
      rightImageSrc: {
        type: String,
        required: true
      },

      /**
       * Content type of the right image
       */
      rightImageContentType: {
        type: String,
        default: null
      },

      /**
       * Width of the right image
       */
      rightImageWidth: {
        type: Number,
        required: true
      },

      /**
       * Height of the right image
       */
      rightImageHeight: {
        type: Number,
        required: true
      },

      /**
       * Attribution for the right image
       *
       * Properties are passed as props to CiteAttribution
       */
      rightImageAttribution: {
        type: Object,
        required: true
      },

      /**
       * If `true`, lazy-load the images
       */
      lazy: {
        type: Boolean,
        default: true
      }
    },

    data() {
      return {
        dragging: false,
        imageWidth: 0,
        sliderWidth: 0,
        sliderPosition: 0.5,
        hideAttribution: null
      };
    },

    computed: {
      leftImageClip() {
        const rightLength = this.imageWidth * this.sliderPosition;
        return {
          clip: `rect(auto, ${rightLength}px, auto, auto)`
        };
      },

      sliderBarPosition() {
        const leftPosition = (this.imageWidth * this.sliderPosition) - (this.sliderWidth / 2);
        return {
          left: `${leftPosition}px`
        };
      }
    },

    beforeDestroy() {
      window.removeEventListener('touchmove', this.stopDrag);
      window.removeEventListener('mousemove', this.drag);
    },

    mounted() {
      this.setSliderWidth();

      window.addEventListener('resize', this.resize);
      window.addEventListener('mousemove', this.mousemove);
      window.addEventListener('mouseup', this.mouseup);
      window.addEventListener('touchmove', this.mousemove);
      window.addEventListener('touchend', this.mouseup);
      this.$refs.rightImage.$el.addEventListener('load', this.setImageWidth);
    },

    methods: {
      resize() {
        this.setImageWidth();
      },

      mousemove(event) {
        this.drag(event);
      },

      mouseup() {
        this.stopDrag();
      },

      setImageWidth() {
        this.imageWidth = this.$refs.rightImage.$el.getBoundingClientRect().width;
      },

      setSliderWidth() {
        this.sliderWidth = this.$refs.slider.getBoundingClientRect().width;
      },

      initDrag() {
        this.dragging = true;
      },

      stopDrag() {
        this.dragging = false;
      },

      showHideAttribution() {
        if (this.sliderPosition < 0.2) {
          this.hideAttribution = 'left';
        } else if (this.sliderPosition > 0.8) {
          this.hideAttribution = 'right';
        } else {
          this.hideAttribution = '';
        }
      },

      drag(event) {
        if (!this.dragging) {
          return;
        }

        // Calc Cursor Position from the left edge of the viewport
        const cursorXfromViewport = event.touches ? event.touches[0].pageX : event.pageX;
        // Calc Cursor Position from the left edge of the window (consider any page scrolling)
        const cursorXfromWindow = cursorXfromViewport - window.pageXOffset;
        // Calc Cursor Position from the left edge of the image
        const imagePosition = this.$refs.rightImage.$el.getBoundingClientRect();
        let pos = cursorXfromWindow - imagePosition.left;

        const minPos = 0 + (this.sliderWidth / 2);
        const maxPos = this.imageWidth - (this.sliderWidth / 2);

        if (pos < minPos) {
          pos = minPos;
        }

        if (pos > maxPos) {
          pos = maxPos;
        }

        this.sliderPosition = pos / this.imageWidth;
        this.showHideAttribution();
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  $slider-dimensions: 48px;

  figure {
    display: inline-block;
  }

  .compare-image {
    position: relative;
    overflow: hidden;

    img {
      width: auto;

      &:nth-child(1) {
        position: absolute;
        top: 0;
        left: 0;
      }
    }

    .slider {
      width: $slider-dimensions;
      height: 100%;
      position: absolute;
      top: 0;
      align-items: center;
      display: flex;

      .slider-handle {
        position: absolute;
        background: rgb(255 255 255 / 50%);
        width: $slider-dimensions;
        height: $slider-dimensions;
        border: 0;
        border-radius: 50%;
        box-shadow: 0 0 6px rgb(0 0 0 / 0%);

        &.is-active {
          background: rgb(255 255 255 / 85%);
        }

        &::before,
        &::after {
          content: '';
          position: absolute;
          width: 10px;
          height: 10px;
          top: 50%;
          border-top: solid 2px;
          border-left: solid 2px;
          transform-origin: 0 0;
        }

        &::before {
          left: 10px;
          transform: rotate(-45deg);
        }

        &::after {
          right: 0;
          transform: rotate(135deg);
        }

        &:hover {
          box-shadow: 0 0 3px rgb(0 0 0 / 40%);

          &::before {
            left: 9px;
          }

          &::after {
            right: -1px;
          }
        }
      }
    }

    & + figcaption {
      cite {
        display: block;
        margin: 0;
        position: static;

        &::before {
          content: attr(data-prefix);
          font-style: normal;
        }
      }

      @media (min-width: $bp-large) {
        cite {
          max-width: 45%;
          position: absolute;
          transition: opacity 0.2s ease-out;

          &::before {
            display: none;
          }

          &:nth-child(2) {
            left: auto;
            margin-left: 1rem;
            margin-right: 0;
            right: 1rem;
          }
        }

        .cite-hidden {
          opacity: 0;
        }
      }
    }
  }
</style>

<docs lang="md">
  ```jsx
  <CompareImageSlider
    left-image-src="https://via.placeholder.com/800x300/085395/FFFFFF?text=Left%20image"
    left-image-content-type="image/png"
    :left-image-width="800"
    :left-image-height="300"
    :left-image-attribution="{
      provider: 'placeholder.com',
      name: 'Dark blue',
      url: 'https://via.placeholder.com/800x300/085395/FFFFFF?text=Left%20image',
      rightsStatement: 'http://creativecommons.org/publicdomain/zero/1.0/'
    }"
    right-image-src="https://via.placeholder.com/800x300/79B2E3/000000?text=Right%20image"
    right-image-content-type="image/png"
    :right-image-width="800"
    :right-image-height="300"
    :right-image-attribution="{
      provider: 'placeholder.com',
      name: 'Light blue',
      url: 'https://via.placeholder.com/800x300/79B2E3/000000?text=Right%20image',
      rightsStatement: 'http://creativecommons.org/publicdomain/zero/1.0/'
    }"
  />
  ```
</docs>
