<template>
  <MediaDefaultThumbnail
    v-if="showDefaultThumbnail"
    :media-type="media.edmType"
    :offset="offset"
    class="h-100"
  />
  <component
    :is="lazy ? 'b-img-lazy' : 'b-img'"
    v-else
    :src="thumbnailSrc"
    :width="thumbnailWidth"
    :height="thumbnailHeight"
    alt=""
    data-qa="media preview image"
    @error="imageNotFound"
    @error.native="imageNotFound"
  />
</template>

<script>
  // TODO create mixin to share with MediaCardImage
  export default {
    name: 'ItemMediaSwiperThumbnail',

    components: {
      MediaDefaultThumbnail: () => import('@/components/media/MediaDefaultThumbnail')
    },
    props: {
      media: {
        type: Object,
        required: true
      },
      offset: {
        type: Number,
        default: null
      },
      lazy: {
        type: Boolean,
        default: true
      }
    },

    data() {
      return {
        showDefaultThumbnail: false
      };
    },

    computed: {
      thumbnails() {
        return this.media.thumbnails(this.$nuxt.context);
      },
      thumbnailSrc() {
        return this.thumbnails.small;
      },
      thumbnailWidth() {
        if (!this.media.ebucoreWidth) {
          return null;
        }
        if (this.media.ebucoreWidth < 200) {
          return this.media.ebucoreWidth;
        }
        return 200;
      },
      thumbnailHeight() {
        if (!this.media.ebucoreHeight || !this.thumbnailWidth) {
          return null;
        }
        return (this.media.ebucoreHeight / this.media.ebucoreWidth) * this.thumbnailWidth;
      }
    },

    methods: {
      imageNotFound() {
        this.showDefaultThumbnail = true;
      }
    }
  };
</script>

<style lang="scss" scoped>
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
