<template>
  <section
    data-qa="media thumbnail grid"
    class="d-flex flex-wrap mb-3"
  >
    <!-- TODO: populate alt, but with what? -->
    <a
      v-for="(thumbnail, index) of thumbnails"
      :key="index"
      ref="thumbnail"
      :class="thumbnailImgClass(thumbnail, index)"
      :data-about="thumbnail.about"
      :data-qa="`media thumbnail anchor #${index + 1}`"
      :aria-label="$t('mediaPreview.selectItem', { src: index + 1 })"
      class="thumbnail-link mb-2 mr-2"
      @click="clickThumbnail(thumbnail.about)"
    >
      <b-img-lazy
        :src="thumbnail.src"
        :data-qa="`media thumbnail #${index + 1}`"
        alt=""
        thumbnail
      />
    </a>
    <button
      v-if="thumbnails.length > showMoreIndex"
      class="pb-0"
      @click="toggleThumbnails"
    >
      {{ showAll ? $t('showLess') : $t('showMore') }}
    </button>
  </section>
</template>

<script>
  export default {
    name: 'MediaThumbnailGrid',

    props: {
      // Array of media items as returned by the API's standard JSON response.
      // Expected to have `about` property with the web resource's URI, and
      // `thumbnails` property with `small` and `large` thumbnail URLs.
      media: {
        type: Array,
        required: true
      },

      // URI of the pre-selected thumbnail, to highlight.
      selected: {
        type: String,
        required: true
      },

      // Size of thumbnail to display.
      // Valid values are 'small' and 'large'.
      size: {
        type: String,
        default: 'small',
        validator: (size) => {
          return ['small', 'large'].includes(size);
        }
      }
    },

    data() {
      return {
        // URI of the currently selected thumbnail.
        currentSelection: this.selected,
        // show all thumbnails, default is a selection
        showAll: false,
        showMoreIndex: 11
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
            src: item.thumbnails[this.size]
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
      },

      /**
       * Toggle the display of all thumbnails
       */
      toggleThumbnails() {
        this.showAll = !this.showAll;

        this.$nextTick(() => {
          this.$refs.thumbnail[this.showMoreIndex].focus();
        });
      },

      thumbnailImgClass(thumbnail, index) {
        const classes = [];
        if (this.isSelected(thumbnail)) classes.push('selected');
        if (index > 10 && !this.showAll) classes.push('d-none');
        return classes.join(' ');
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "./assets/scss/variables.scss";

  .thumbnail-link {
    height: 5.5rem;
    width: 5.5rem;
    border: 1px solid $paper;
    overflow: hidden;

    &.selected {
      border-color: $blue;
      border-width: 2px;
    }
  }

  .img-thumbnail {
    padding: 0;
    border: 0;
    border-radius: 0;
    width: 5.5rem;
    height: 5.5rem;
    object-fit: cover;
  }

  button {
    background-color: transparent;
    border-color: $blue;
    color: $blue;
    font-size: $font-size-small;
    height: 5.5rem;
    text-transform: uppercase;
    width: 5.5rem;
  }

</style>
