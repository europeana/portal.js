<template>
  <!-- TODO: are we only ever using large thumbnails here? why? stop storing small? -->
  <div
    class="media-card-image"
  >
    <b-link
      v-if="linkable && imageLink && thumbnails.large && !resource.edm.forEdmIsShownAt"
      :href="imageLink"
      target="_blank"
    >
      <MediaDefaultThumbnail
        v-if="showDefaultThumbnail"
        :media-type="resource.edm.edmType || edmType"
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
        :media-type="resource.edm.edmType || edmType"
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
    // TODO: rename to ItemMediaPreview?
    name: 'MediaCardImage',

    components: {
      MediaDefaultThumbnail: () => import('../media/MediaDefaultThumbnail')
    },

    props: {
      resource: {
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
      /**
       * edm:type property of the parent item
       */
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
      imageLink() {
        return this.$apis.record.mediaProxyUrl(this.resource.id, this.europeanaIdentifier, { disposition: 'inline' });
      },
      thumbnails() {
        if (this.resource.isIIIFImageService) {
          return {
            large: `${this.resource.service.id}/full/${LARGE_THUMBNAIL_WIDTH},/0/default.jpg`,
            small: `${this.resource.service.id}/full/${SMALL_THUMBNAIL_WIDTH},/0/default.jpg`
          };
        } else {
          // NOTE: need to use resource.edm for the edm:object handling on edm:isShownAt/edm:isShownBy
          return this.$apis.thumbnail.forWebResource(this.resource.edm);
        }
      },
      thumbnailSrc() {
        return this.thumbnails[this.thumbnailSize];
      },
      thumbnailWidth() {
        if (!this.resource.width) {
          return null;
        }
        const thumbnailMaxSize = this.thumbnailSize === 'large' ? LARGE_THUMBNAIL_WIDTH : SMALL_THUMBNAIL_WIDTH;
        if (this.resource.width < thumbnailMaxSize) {
          return this.resource.width;
        }
        return thumbnailMaxSize;
      },
      thumbnailHeight() {
        if (!this.resource.height || !this.thumbnailWidth) {
          return null;
        }
        return (this.resource.height / this.resource.width) * this.thumbnailWidth;
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
