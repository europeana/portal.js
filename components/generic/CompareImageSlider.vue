<template>
  <figure
    ref="container"
    class="compare-image"
  >
    <img
      ref="imageLeft"
      :src="imageLeft"
      :alt="imageLeftText"
      class="compare-image__image-left"
      :style="leftImageClip"
    >
    <img
      ref="imageRight"
      :src="imageRight"
      :alt="imageRightText"
      class="compare-image__image-right"
    >
    <div
      ref="slider"
      class="compare-image__slider"
      :style="sliderBarPosition"
    >
      <span class="compare-image__slider__bar" />
      <button
        :class="{ 'is-active' : dragging }"
        class="compare-image__slider__handle"
      >
        <span class="sr-only">Slider Handle</span>
      </button>
    </div>
  </figure>
</template>

<script>
  export default {
    name: 'CompareImageSlider',

    props: {
      imageLeft: {
        type: String,
        required: true
      },

      imageRight: {
        type: String,
        required: true
      },

      imageLeftText: {
        type: String,
        default: 'This is an image'
      },

      imageRightText: {
        type: String,
        default: 'This is an image'
      }
    },

    data() {
      return {
        dragging: false,
        imageWidth: 0,
        sliderWidth: 0,
        sliderPosition: 0.5
      };
    },

    computed: {
      leftImageClip() {
        return {
          clip: `rect(auto, ${this.imageWidth * this.sliderPosition}px, auto, auto)`
        };
      },

      sliderBarPosition() {
        return {
          left: `${this.imageWidth * this.sliderPosition - this.sliderWidth / 2}px`
        };
      }
    },

    mounted() {
      const slider = this.$refs.slider;
      this.setImageWidth();
      this.setSliderWidth();

      window.addEventListener('resize', this.setImageWidth);

      slider.addEventListener('mousedown', this.initDrag);
      window.addEventListener('mousemove', this.drag);
      window.addEventListener('mouseup', this.stopDrag);
    },

    methods: {
      setImageWidth() {
        this.imageWidth = this.$refs.imageRight.getBoundingClientRect().width;
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

      drag(event) {
        // Calc Cursor Position from the left edge of the viewport
        const cursorXfromViewport = event.pageX;
        // Calc Cursor Position from the left edge of the window (consider any page scrolling)
        const cursorXfromWindow = cursorXfromViewport - window.pageXOffset;
        // Calc Cursor Position from the left edge of the image
        const imagePosition = this.$refs.imageRight.getBoundingClientRect();
        let pos = cursorXfromWindow - imagePosition.left;

        const minPos = 0 + this.sliderWidth / 2;
        const maxPos = this.imageWidth - this.sliderWidth / 2;

        if (pos < minPos) {
          pos = minPos;
        }

        if (pos > maxPos) {
          pos = maxPos;
        }

        if (this.dragging) {
          this.sliderPosition = pos / this.imageWidth;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  $slider-width: 48px;

  .compare-image {
    position: relative;
    overflow: hidden;

    &__image-left,
    &__image-right {
      width: 100%;
    }

    &__image-left {
      position: absolute;
      top: 0;
      left: 0;
    }

    &__slider {
      width: $slider-width;
      height: 100%;
      position: absolute;
      top: 0;
      justify-content: center;
      align-items: center;
      display: flex;

      // &__bar {
        // background: white;
        // min-width: 2px;
        // height: 100%;
        // display: flex;
      // }

      &__handle {
        display: flex;
        position: absolute;
        background: rgba(255, 255, 255, 0.5);
        width: $slider-width;
        height: 48px;
        border: 0;
        border-radius: 50%;
        box-shadow: 0 0 6px rgba(0, 0, 0, 0);

        &.is-active {
          background: rgba(255, 255, 255, 0.85);
        }

        &:before,
        &:after {
          content: '';
          position: absolute;
          width: 10px;
          height: 10px;
          top: 50%;
          border-top: solid 2px;
          border-left: solid 2px;
          transform-origin: 0 0;
        }

        &:before {
          left: 10px;
          transform: rotate(-45deg);
        }

        &:after {
          right: 0;
          transform: rotate(135deg);
        }

        &:hover {
          box-shadow: 0 0 3px rgba(0, 0, 0, 0.4);

          &:before {
            left: 9px;
          }

          &:after {
            right: -1px;
          }
        }
      }
    }
  }
</style>
