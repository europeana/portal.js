<template>
  <!-- TODO: are we only ever using large thumbnails here? why? stop storing small? -->
  <div
    class="media-card-image"
  >
    <b-link
      v-if="linkable && imageLink && thumbnails.large && !media.forEdmIsShownAt"
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
  import WebResource from '@/plugins/europeana/edm/WebResource.js';
  import {
    LARGE_WIDTH as LARGE_THUMBNAIL_WIDTH,
    SMALL_WIDTH as SMALL_THUMBNAIL_WIDTH
  } from '@/plugins/europeana/thumbnail.js';

  export default {
    name: 'MediaCardImage',

    components: {
      MediaDefaultThumbnail: () => import('../media/MediaDefaultThumbnail')
    },

    props: {
      media: {
        // TODO: refactor to only receive EuropeanaMediaResource, once legacy
        //       media presentation is gone
        type: WebResource,
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
      imageLink() {
        return this.$apis.record.mediaProxyUrl(this.media.about, this.europeanaIdentifier, { disposition: 'inline' });
      },
      thumbnails() {
        if (this.media.svcsHasService) {
          // TODO: assess impact of this outside of new ItemMediaPresentation component
          const serviceId = this.media.svcsHasService.id || this.media.svcsHasService.about || this.media.svcsHasService;
          return {
            large: `${serviceId}/full/${LARGE_THUMBNAIL_WIDTH},/0/default.jpg`,
            small: `${serviceId}/full/${SMALL_THUMBNAIL_WIDTH},/0/default.jpg`
          };
        } else {
          return this.$apis.thumbnail.forWebResource(this.media);
        }
      },
      thumbnailSrc() {
        return this.thumbnails[this.thumbnailSize];
      },
      thumbnailWidth() {
        if (!this.media.ebucoreWidth) {
          return null;
        }
        const thumbnailMaxSize = this.thumbnailSize === 'large' ? LARGE_THUMBNAIL_WIDTH : SMALL_THUMBNAIL_WIDTH;
        if (this.media.ebucoreWidth < thumbnailMaxSize) {
          return this.media.ebucoreWidth;
        }
        return thumbnailMaxSize;
      },
      thumbnailHeight() {
        if (!this.media.ebucoreHeight || !this.thumbnailWidth) {
          return null;
        }
        return (this.media.ebucoreHeight / this.media.ebucoreWidth) * this.thumbnailWidth;
      },
      edmTypeWithFallback() {
        return this.media.edmType || this.edmType;
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
