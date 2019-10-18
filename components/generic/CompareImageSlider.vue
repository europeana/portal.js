<template>
  <figure ref="container">
    <div
      class="compare-image"
      data-qa="compare image"
    >
      <img
        ref="leftImage"
        :src="leftImageSrc"
        :style="leftImageClip"
        data-qa="compare image left image"
      >
      <img
        ref="rightImage"
        :src="rightImageSrc"
        data-qa="compare image right image"
      >

      <div
        ref="slider"
        class="slider"
        :style="sliderBarPosition"
        data-qa="compare image slider"
        @mousedown="initDrag"
      >
        <span class="slider-bar" />
        <button
          :class="{ 'is-active' : dragging }"
          class="slider-handle"
          data-qa="compare image slider handler"
        >
          <span class="sr-only">Slider Handle</span>
        </button>
      </div>
    </div>
    <figcaption>
      <label data-qa="compare image left attribution">
        {{ $t('directions.left') }}
        <CiteAttribution
          :name="leftImageAttribution.name"
          :creator="leftImageAttribution.creator"
          :provider="leftImageAttribution.provider"
          :rights-statement="leftImageAttribution.rightsStatement"
          :url="leftImageAttribution.url"
        />
      </label>
      <br>
      <label data-qa="compare image right attribution">
        {{ $t('directions.right') }}
        <CiteAttribution
          :name="rightImageAttribution.name"
          :creator="rightImageAttribution.creator"
          :provider="rightImageAttribution.provider"
          :rights-statement="rightImageAttribution.rightsStatement"
          :url="rightImageAttribution.url"
        />
      </label>
    </figcaption>
  </figure>
</template>

<script>
  import CiteAttribution from '../../components/generic/CiteAttribution';

  export default {
    name: 'CompareImageSlider',

    components: {
      CiteAttribution
    },

    props: {
      leftImageSrc: {
        type: String,
        required: true
      },

      rightImageSrc: {
        type: String,
        required: true
      },

      leftImageAttribution: {
        type: Object,
        required: true
      },

      rightImageAttribution: {
        type: Object,
        required: true
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
        const rightLength = this.imageWidth * this.sliderPosition;

        return {
          clip: `rect(auto, ${rightLength}px, auto, auto)`
        };
      },

      sliderBarPosition() {
        const leftPosition = this.imageWidth * this.sliderPosition - this.sliderWidth / 2;
        return {
          left: `${leftPosition}px`
        };
      }
    },

    mounted() {
      this.setImageWidth();
      this.setSliderWidth();

      window.addEventListener('resize', this.setImageWidth);
      window.addEventListener('mousemove', this.drag);
      window.addEventListener('mouseup', this.stopDrag);
    },

    methods: {
      setImageWidth() {
        this.imageWidth = this.$refs.rightImage.getBoundingClientRect().width;
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
        const imagePosition = this.$refs.rightImage.getBoundingClientRect();
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
  $slider-dimensions: 48px;

  .compare-image {
    position: relative;
    overflow: hidden;

    img {
      width: 100%;

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
        background: rgba(255, 255, 255, 0.5);
        width: $slider-dimensions;
        height: $slider-dimensions;
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
