<template>
  <div class="story-image-text-slide-scroller mb-5">
    <div
      v-for="(slide, index) in section.hasPartCollection.items"
      :key="`slide-image-${index}`"
      ref="slideImages"
      class="slide-images"
    >
      <div class="image-wrapper">
        <ImageWithAttribution
          :alt="slide.image?.image?.description"
          :src="slide.image?.image?.url"
          :content-type="slide.image?.image?.contentType"
          :attribution="slide.image"
          :contentful-image-crop-presets="FULL_VIEWPORT_PRESETS"
          :picture-source-media-resolutions="[1, 2, 3]"
          :lazy="true"
          width="auto"
          height="auto"
          :max-width="null"
        />
      </div>
    </div>
    <div
      v-for="(slide, index) in section.hasPartCollection.items"
      :key="`slide-card-${index}`"
      ref="slideCards"
      class="slide-cards"
    >
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
  import ImageWithAttribution from '@/components/image/ImageWithAttribution';
  import { FULL_VIEWPORT_PRESETS } from '@/utils/contentful/imageCropPresets';

  export default {
    name: 'StoryImageTextSlideScroller',

    components: {
      ImageWithAttribution
    },

    mixins: [parseMarkdownHtmlMixin],

    props: {
      section: {
        type: Object,
        required: true
      }
    },

    data() {
      return {
        FULL_VIEWPORT_PRESETS
      };
    },

    mounted() {
      window.addEventListener('scroll', this.appearDisappearSlideImage);
    },

    beforeDestroy() {
      window.removeEventListener('scroll', this.appearDisappearSlideImage);
    },

    methods: {
      appearDisappearSlideImage() {
        this.$refs.slideCards.forEach((card, index) => {
          if (index > 0) {
            const distanceCardToViewport = card.getBoundingClientRect();

            if (distanceCardToViewport.top < window.innerHeight) {
              this.$refs.slideImages[index].style = 'z-index: 1; opacity: 1;';
            }

            if (distanceCardToViewport.top > window.innerHeight) {
              this.$refs.slideImages[index].style = 'z-index: -1; opacity: 0; transition: opacity 750ms, z-index 0ms 750ms;';
            }
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .story-image-text-slide-scroller {
    width: 100%;
    position: relative;

    .slide-images {
      position: sticky;
      top: 0;
      width: 100%;
      height: 100vh;
      overflow: hidden;

      &:nth-child(n+2) {
        margin-top: -100vh;
        z-index: -1;
        opacity: 0;
        transition: opacity 750ms;
      }
    }

    .image-wrapper {
      height: 100%;

      figure {
        height: 100%;
        width: 100%;

        ::v-deep .icon-info {
          bottom: 15px;
          left: 15px;
          right: auto;
          z-index: 3;

          @media (min-width: $bp-medium) {
            bottom: 1.5rem;
            left: 1.5rem;
          }
        }

        ::v-deep cite {
          bottom: 0.5rem;
          left: 0.5rem;
          right: auto !important;
          z-index: 3;
        }
      }
    }

    ::v-deep img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .card {
      box-shadow: $boxshadow-small;
      margin-bottom: 150vh;
      position: relative;
      z-index: 3;
    }

    .card-content ::v-deep p:last-child {
      margin-bottom: 0;
    }
  }
</style>
