<template>
  <NuxtLink
    :to="link"
    class="item-media-thumbnail text-lowercase text-decoration-none"
  >
    <MediaCardImage
      :media="resource.edm"
      :lazy="lazy"
      :offset="offset"
      :edm-type="edmType"
      thumbnail-size="small"
      :linkable="false"
    />
    <span class="thumbnail-content d-flex flex-wrap align-items-center position-absolute">
      {{ label }}
      <span
        class="icon-media-type ml-auto"
        :class="mediaTypeIconClass"
      />
    </span>
  </NuxtLink>
</template>

<script>
  import MediaCardImage from '../media/MediaCardImage.vue';
  import EuropeanaMediaResource from '@/utils/europeana/media/Resource.js';

  export default {
    name: 'ItemMediaThumbnail',

    components: {
      MediaCardImage
    },
    props: {
      resource: {
        type: EuropeanaMediaResource,
        required: true
      },
      offset: {
        type: Number,
        default: 0
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
      link() {
        return {
          path: this.$route.path,
          query: { ...this.$route.query, page: this.page },
          hash: this.$route.hash
        };
      },
      page() {
        return this.offset + 1;
      },
      mediaTypeIconClass() {
        const mediaType = this.resource.edm.edmType || this.edmType;
        return mediaType ? `icon-${mediaType.toLowerCase()}-bold` : '';
      },
      label() {
        return this.$n(this.page);
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';

  .item-media-thumbnail {
    background-color: $grey;
    padding: 0;
    width: auto;
    height: 3.625rem;
    min-width: 3rem;
    display: flex;
    align-items: stretch;
    justify-content: center;
    overflow: hidden;
    margin-right: 1rem;
    position: relative;
    border-radius: 0;
    color: $black;

    @media (min-width: $bp-medium) {
      height: 7.75rem;
    }

    @media (min-width: $bp-large) {
      width: 11rem;
      height: auto;
      min-height: 5rem;
      max-height: 28rem;
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

    &.selected {
      outline: 2px solid $blue;
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

    .thumbnail-content {
      left: 0.25rem;
      right: 0.25rem;
      bottom: 0.25rem;
      z-index: 1;
      font-size: $font-size-small;
      color: $white;
      line-height: 1;

      @media (min-width: $bp-medium) {
        left: 0.5rem;
        right: 0.5rem;
        bottom: 0.5rem;
      }

      @media (min-width: $bp-large) {
        left: 1rem;
        right: 0.75rem;
        bottom: 0.75rem;
      }
    }

    .media-card-image {
      width: 100%;

      @media (min-width: $bp-large) {
        height: auto;
      }

      .default-thumbnail {
        width: 100%;
        height: 100%;
        min-width: 3rem;
        aspect-ratio: auto;

        @media (min-width: $bp-medium) {
          min-width: 5rem;
        }

        [class^='icon-'] {
          @media (max-width: ($bp-medium - 1px)) {
            font-size: $font-size-large;
          }
        }
      }

      .card-img {
        border-radius: 0;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .icon-media-type {
      @media (min-width: $bp-medium) {
        font-size: $font-size-large;
      }
    }
  }
</style>
