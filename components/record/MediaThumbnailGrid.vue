<template>
  <section>
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
      media: {
        type: Array,
        required: true
      },

      selected: {
        type: String,
        required: true
      },

      size: {
        type: String,
        default: 'w200'
      }
    },

    data() {
      return {
        currentSelection: this.selected
      };
    },

    computed: {
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
      isSelected(thumbnail) {
        return thumbnail.key === this.currentSelection;
      },

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
