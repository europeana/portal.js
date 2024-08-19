<template>
  <b-button
    class="swiper-slide-thumbnail"
    @click="$emit('click')"
  >
    <MediaDefaultThumbnail
      v-if="showDefaultThumbnail"
      :media-type="media.edmType"
      :offset="index"
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
    <span class="swiper-slide-thumbnail-page">{{ `p. ${index + 1}` }}</span>
    <span
      class="icon-media-type"
      :class="mediaTypeIconClass"
    />
  </b-button>
</template>

<script>
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
      index: {
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
      },
      mediaTypeIconClass() {
        return this.media.edmType ? `icon-${this.media.edmType.toLowerCase()}-bold` : '';
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
  @import '@europeana/style/scss/variables';

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .icon-media-type {
    position: absolute;
    right: 1rem;
    z-index: 1;
    bottom: 1rem;
    color: $white;
    font-size: 1.5rem;
  }

  .swiper-slide-thumbnail {
    background-color: $grey;
    padding: 0;
    flex-shrink: 0;
    width: 11rem;
    height: 7.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    margin-right: 1rem;
    position: relative;;

    @media (min-width: $bp-large) {
      margin-bottom: 1rem;
    }

    &:last-child {
      margin-right: 0;

      @media (min-width: $bp-large) {
        margin-bottom: 0;
      }
    }

    &::after {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      right:0;
      bottom: 0;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.70) 100%);
    }
  }

  .swiper-slide-thumbnail-page {
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    color: $white;
    font-size: 0.75rem;
    z-index: 1;
  }
</style>
