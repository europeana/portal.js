<template>
  <section
    data-qa="media thumbnail grid"
  >
    <!-- TODO: populate alt, but with what? -->
    <b-img
      v-for="thumbnail of thumbnails"
      :key="thumbnail.key"
      :src="thumbnail.src"
      :class="{ 'selected' : isSelected(thumbnail) }"
      thumbnail
      alt=""
      @click="clickThumbnail(thumbnail.key)"
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
       * * `key`: the URI of the media item
       * * `src`: the URL of the thumbnail
       * @return {Object[]} Array of thumbnail objects
       */
      thumbnails() {
        return this.media.map((item) => {
          return {
            key: item.about,
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
        return thumbnail.key === this.currentSelection;
      },

      /**
       * Handle clicking on a thumbnail to make it the selected one, and
       * emit the `select` event with the media's URI.
       * @param {string} thumbnailKey Key of the thumbnail object, i.e. its URI
       */
      clickThumbnail(thumbnailKey) {
        this.currentSelection = thumbnailKey;
        this.$emit('select', thumbnailKey);
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
