<template>
  <figure
    ref="container"
    class="compare-image-wrapper"
  >
    <div
      class="compare-image"
      data-qa="compare image"
    >
      <ImageOptimised
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
      <ImageOptimised
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
    <figcaption :style="`max-width: ${imageWidth}px`">
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
  import CiteAttribution from '../generic/CiteAttribution';
  import ImageOptimised from './ImageOptimised';

  /**
   * Slider to compare two images side-by-side
   */
  export default {
    name: 'ImageComparisonSlider',

    components: {
      CiteAttribution,
      ImageOptimised
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

<style lang="scss">
  @import '@europeana/style/scss/variables';

  .compare-image-wrapper {
    $slider-dimensions: 48px;

    display: inline-block;
    overflow: hidden;
    margin: 0;
    width: auto;
    height: 100%;
    background: $white;

    img {
      width: auto;
      object-fit: contain;
    }

    figcaption {
      cite {
        border-radius: 0;
        border-top-left-radius: $border-radius-small;
        border-top-right-radius: $border-radius-small;
        bottom: 0;
        font-size: 0.625rem;
        left: 1rem;
        margin-right: 1rem;
        padding: 0.5rem 1rem;

        .attribution > span {
          margin-left: 0.25rem;
        }
      }
    }

    .compare-image {
      position: relative;
      overflow: hidden;

      img {
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
  }
</style>

<docs lang="md">
  ```jsx
  <ImageComparisonSlider
    left-image-src="https://api.europeana.eu/thumbnail/v3/400/e9246ea9b899e724216689ea7df02c5b"
    left-image-content-type="image/jpeg"
    :left-image-width="400"
    :left-image-height="634"
    :left-image-attribution="{
      provider: 'Real Jardín Botánico Madrid',
      name: 'Iris bulbosa versicolor ',
      url: 'https://api.europeana.eu/thumbnail/v3/400/e9246ea9b899e724216689ea7df02c5b',
      rightsStatement: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
    }"
    right-image-src="https://api.europeana.eu/thumbnail/v3/400/1b25d6df603f228942a145629ed2b129"
    right-image-content-type="image/jpeg"
    :right-image-width="400"
    :right-image-height="622"
    :right-image-attribution="{
      provider: 'Real Jardín Botánico Madrid',
      name: 'Gentianella autumnalis ',
      url: 'https://api.europeana.eu/thumbnail/v3/400/1b25d6df603f228942a145629ed2b129',
      rightsStatement: 'http://creativecommons.org/licenses/by-nc-sa/4.0/'
    }"
  />
  ```
</docs>
