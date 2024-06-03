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
        <b-container>
          <b-row class="justify-content-end">
            <b-col
              cols="12"
              class="col-md-6 col-lg-4"
            >
              <!-- eslint-disable vue/no-v-html -->
              <b-card
                body-class="p-4"
                class="border-none"
              >
                <div
                  class="card-content"
                  v-html="parseMarkdownHtml(slide.text)"
                />
              </b-card>
              <!-- eslint-enable vue/no-v-html -->
            </b-col>
          </b-row>
        </b-container>
      </div>
    </div>
  </div>
</template>

<script>
  import parseMarkdownHtmlMixin from '@/mixins/parseMarkdownHtml';

  export default {
    name: 'StoryImageTextSlideScroller',

    mixins: [parseMarkdownHtmlMixin],

    props: {
      section: {
        type: Object,
        required: true
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

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

      .card {
        box-shadow: $boxshadow-small;
      }

      .card-content ::v-deep p:last-child {
        margin-bottom: 0;
      }
    }
  }
</style>
