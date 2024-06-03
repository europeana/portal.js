<template>
  <div class="story-image-text-slide-scroller">
    <div
      v-for="(slide, index) in section.hasPartCollection.items"
      :key="index"
      ref="slide"
      class="slide"
    >
      <!-- TODO: replace with ImageWithAttribution -->
      <div class="image-wrapper">
        <img
          :src="slide.image?.image?.url"
          :alt="slide.image?.image?.description"
        >
      </div>
      <div class="card-wrapper">
        <b-card>
          <p>{{ slide.text }}</p>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      section: {
        type: Object,
        required: true
      }
    }
  };
</script>

<style lang="scss" scoped>
  .story-image-text-slide-scroller {

    .slide {
      width: 100%;

      // &:nth-child(n+2) {
      //   margin-top: -100vh;
      //   z-index: -1;
      //   position: relative;
      // }

      .image-wrapper {
        position: sticky;
        top: 0;
        width: 100%;
        height: 100vh;
        overflow: hidden;
      }

      img {
        position: absolute;
        display: block;
        width:100%;
        height:100%;
        object-fit: cover;
      }

      .card-wrapper {
        min-height: 100vh;
      }
    }
  }
</style>
