<template>
  <section
    data-qa="media thumbnail grid"
  >
    <!-- TODO: populate alt, but with what? -->
    <b-img
      v-for="thumbnail of thumbnails"
      :key="thumbnail.about"
      :src="thumbnail.src"
      :class="{ 'selected' : isSelected(thumbnail) }"
      :data-about="thumbnail.about"
      thumbnail
      alt=""
      @click="clickThumbnail(thumbnail.about)"
    />
  </section>
</template>

<script>
  import { thumbnailUrl } from  '../../plugins/europeana/utils';

  export default {
    name: 'MediaThumbnailGrid',

    props: {
      // Array of media items as returned by the API's standard JSON response.
      // Expected to have `about` property with the web resource's URI.
      media: {
        type: Array,
        required: true
      },

      // URI of the pre-selected thumbnail, to highlight.
      selected: {
        type: String,
        required: true
      },

      // Size of thumbnail to display, passed to the thumbnail API.
      // Valid values are 'w200' and 'w400'.
      size: {
        type: String,
        default: 'w200',
        validator: (size) => {
          return ['w200', 'w400'].includes(size);
        }
      }
    },

    data() {
      return {
        // URI of the currently selected thumbnail.
        currentSelection: this.selected
      };
    },

    computed: {
      /**
       * Construct thumbnails for media items using the Thumbnail API.
       *
       * Each object in the response has properties:
       * * `about`: the URI of the media item
       * * `src`: the URL of the thumbnail
       * @return {Object[]} Array of thumbnail objects
       */
      thumbnails() {
        return this.media.map((item) => {
          return {
            about: item.about,
            // TODO: derive `type` for the web resource, and pass to API
            src: thumbnailUrl(item.about, { size: this.size })
          };
        });
      }
    },

    methods: {
      /**
       * Is this thumbnail the currently selected one?
       * @param {Object} thumbnail Thumbnail object constructed by `thumbnails()`
       * @return {Boolean}
       */
      isSelected(thumbnail) {
        return thumbnail.about === this.currentSelection;
      },

      /**
       * Handle clicking on a thumbnail to make it the selected one, and
       * emit the `select` event with the media's URI.
       * @param {string} thumbnailabout about of the thumbnail object, i.e. its URI
       */
      clickThumbnail(thumbnailabout) {
        this.currentSelection = thumbnailabout;
        this.$emit('select', thumbnailabout);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "./assets/scss/variables.scss";

  .img-thumbnail.selected {
    border-color: $blue;
  }
</style>
