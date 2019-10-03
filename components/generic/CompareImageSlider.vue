<template>
  <figure
    ref="container"
    class="compare-image"
  >
    <img
      ref="imageLeft"
      src="https://www.fillmurray.com/640/360"
      class="compare-image__image-left"
      :style="leftImageClip"
    >
    <img
      ref="imageRight"
      src="https://www.placecage.com/640/360"
      class="compare-image__image-right"
    >
    <div
      ref="slider"
      class="compare-image__slider"
      :style="sliderBarPosition"
    >
      <span class="compare-image__slider__bar" />
      <span class="compare-image__slider__handle">
        button
      </span>
    </div>
  </figure>
</template>

<script>
  export default {
    name: 'CompareImageSlider',

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
          left: `${this.imageWidth * this.sliderPosition - this.sliderWidth/2}px`
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
      width: 20px;
      height: 100%;
      position: absolute;
      top: 0;
      justify-content: center;
      align-items: center;
      display: flex;

      &__bar {
        background: white;
        min-width: 2px;
        height: 100%;
        display: flex;
      }

      &__handle {
        display: flex;
        position: absolute;
        background: white;
      }
    }
  }
</style>
