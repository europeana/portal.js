<template>
  <!-- TODO: are we only ever using large thumbnails here? why? stop storing small? -->
  <div
    class="media-card-image"
  >
    <b-link
      v-if="linkable && imageLink && thumbnails.large && !forEdmIsShownAt"
      :href="imageLink"
      target="_blank"
    >
      <MediaDefaultThumbnail
        v-if="showDefaultThumbnail"
        :media-type="edmTypeWithFallback"
        :offset="offset"
      />
      <component
        :is="lazy ? 'b-img-lazy' : 'b-img'"
        v-else
        :src="thumbnailSrc"
        :width="thumbnailWidth"
        :height="thumbnailHeight"
        class="w-auto"
        alt=""
        @error="imageNotFound"
        @error.native="imageNotFound"
      />
      <span
        class="sr-only"
      >
        ({{ $t('newWindow') }})
      </span>
    </b-link>
    <template
      v-else-if="thumbnails.large"
    >
      <MediaDefaultThumbnail
        v-if="showDefaultThumbnail"
        :media-type="edmTypeWithFallback"
        :offset="offset"
      />
      <component
        :is="lazy ? 'b-img-lazy' : 'b-img'"
        v-else
        :src="thumbnailSrc"
        :width="thumbnailWidth"
        :height="thumbnailHeight"
        alt=""
        class="mw-100"
        @error="imageNotFound"
        @error.native="imageNotFound"
      />
    </template>
  </div>
</template>

<script>
  import EuropeanaMediaResource from '@/utils/europeana/media/Resource.js';
  import {
    LARGE_WIDTH as LARGE_THUMBNAIL_WIDTH,
    SMALL_WIDTH as SMALL_THUMBNAIL_WIDTH
  } from '@/plugins/europeana/thumbnail.js';

  export default {
    name: 'MediaCardImage',

    components: {
      MediaDefaultThumbnail: () => import('../media/MediaDefaultThumbnail')
    },

    inject: ['item'],

    props: {
      media: {
        type: EuropeanaMediaResource,
        default: null
      },
      lazy: {
        type: Boolean,
        default: true
      },
      europeanaIdentifier: {
        type: String,
        default: ''
      },
      edmType: {
        type: String,
        default: null
      },
      offset: {
        type: Number,
        default: null
      },
      thumbnailSize: {
        type: String,
        default: 'large'
      },
      linkable: {
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
      forEdmIsShownAt() {
        return this.media.id === this.item?.providerAggregation?.edmIsShownAt;
      },
      imageLink() {
        return this.$apis.record.mediaProxyUrl(this.media.id, this.europeanaIdentifier, { disposition: 'inline' });
      },
      thumbnails() {
        if (this.media.service?.profile?.startsWith('http://iiif.io/api/image/')) {
          // TODO: mv to fn on Service class?
          return {
            large: `${this.media.service.id}/full/${LARGE_THUMBNAIL_WIDTH},/0/default.jpg`,
            small: `${this.media.service.id}/full/${SMALL_THUMBNAIL_WIDTH},/0/default.jpg`
          };
        } else {
          return this.$apis.thumbnail.forWebResource(this.media.id, this.item);
        }
      },
      thumbnailSrc() {
        return this.thumbnails[this.thumbnailSize];
      },
      thumbnailWidth() {
        if (!this.media.width) {
          return null;
        }
        const thumbnailMaxSize = this.thumbnailSize === 'large' ? LARGE_THUMBNAIL_WIDTH : SMALL_THUMBNAIL_WIDTH;
        if (this.media.width < thumbnailMaxSize) {
          return this.media.width;
        }
        return thumbnailMaxSize;
      },
      thumbnailHeight() {
        if (!this.media.height || !this.thumbnailWidth) {
          return null;
        }
        return (this.media.height / this.media.width) * this.thumbnailWidth;
      },
      edmTypeWithFallback() {
        return this.edmType || this.item.edmType;
      }
    },

    methods: {
      imageNotFound() {
        this.showDefaultThumbnail = true;
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';

  .media-card-image {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    a {
      text-decoration: none;
    }

    img {
      height: auto;

      @media (max-height: $bp-medium) {
        max-height: $media-viewer-height;
      }

      @media (min-height: $bp-medium) {
        max-height: $media-viewer-height-max;
      }

      @media (max-width: $bp-medium) {
        max-height: $media-viewer-height-medium;
      }
    }
  }
</style>
