<template>
  <div class="story-image-text-slide-scroller">
    <div
      v-for="(slide, index) in section.hasPartCollection.items"
      :key="index"
      ref="slide"
      class="slide"
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

        figure {
          height: 100%;

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
