<template>
  <b-button
    class="swiper-slide-thumbnail text-lowercase"
    data-qa="swiper slide thumbnail"
    @click="$emit('click')"
  >
    <MediaCardImage
      :media="media"
      :lazy="lazy"
      :offset="index"
      :edm-type="edmType"
      thumbnail-size="small"
      :linkable="false"
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
      MediaCardImage: () => import('@/components/media/MediaCardImage')
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
      },
      edmType: {
        type: String,
        default: null
      }
    },

    computed: {
      mediaTypeIconClass() {
        const mediaType = this.media.edmType || this.edmType;
        return mediaType ? `icon-${mediaType.toLowerCase()}-bold` : '';
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
    right: 0.5rem;
    bottom: 0.5rem;
    z-index: 1;
    color: $white;
    font-size: $font-size-small;
    line-height: 1;

    @media (min-width: $bp-medium) {
      font-size: $font-size-large;
      right: 0.75rem;
      bottom: 0.75rem;
    }
  }

  .swiper-slide-thumbnail {
    background-color: $grey;
    padding: 0;
    flex-shrink: 0;
    width: 5.125rem;
    height: 3.625rem;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    margin-right: 1rem;
    position: relative;
    border-radius: 0;
    color: $black;

    @media (min-width: $bp-medium) {
      width: 11rem;
      height: 7.75rem;
    }

    @media (min-width: $bp-large) {
      margin-bottom: 1rem;
    }

    &:last-child {
      margin-right: 0;
    }

    &.btn-secondary {
      &:hover,
      &:not(:disabled):not(.disabled):active:hover,
      &:not(:disabled):not(.disabled).active:hover {
        color: $black;
        background-color: $grey;
        box-shadow: none;
      }
    }

    &::after {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.70) 100%);
    }

    &.swiper-slide-active {
      border: 2px solid $blue;
    }

    ::v-deep .media-card-image {
      width: 100%;
      height: 100%;

      div {
        width: 100%;
        height: 100%;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    ::v-deep .card-img {
      border-radius: 0;
    }
  }

  .swiper-slide-thumbnail-page {
    position: absolute;
    bottom: 0.5rem;
    left: 0.5rem;
    color: $white;
    z-index: 1;
    line-height: 1;

    @media (min-width: $bp-medium) {
      font-size: $font-size-small;
      bottom: 1rem;
      left: 1rem;
    }
  }
</style>
