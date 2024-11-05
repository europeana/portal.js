<template>
  <!-- TODO: are we only ever using large thumbnails here? why? stop storing small? -->
  <div
    class="media-card-image"
  >
    <b-link
      v-if="linkable && imageLink && thumbnails.large && !webResource.forEdmIsShownAt"
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
  import WebResource from '@/plugins/europeana/edm/WebResource.js';

  export default {
    name: 'MediaCardImage',

    components: {
      MediaDefaultThumbnail: () => import('../media/MediaDefaultThumbnail')
    },

    props: {
      media: {
        // TODO: refactor to only receive EuropeanaMediaResource, once legacy
        //       media presentation is gone
        type: [EuropeanaMediaResource, WebResource],
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
        webResource: (this.media instanceof WebResource) ? this.media : this.media.edm,
        showDefaultThumbnail: false
      };
    },

    computed: {
      imageLink() {
        return this.$apis.record.mediaProxyUrl(this.webResource.about, this.europeanaIdentifier, { disposition: 'inline' });
      },
      thumbnails() {
        return this.webResource.thumbnails(this.$nuxt.context);
      },
      thumbnailSrc() {
        return this.thumbnails[this.thumbnailSize];
      },
      thumbnailWidth() {
        if (!this.webResource.ebucoreWidth) {
          return null;
        }
        const thumbnailMaxSize = this.thumbnailSize === 'large' ? 400 : 200;
        if (this.webResource.ebucoreWidth < thumbnailMaxSize) {
          return this.webResource.ebucoreWidth;
        }
        return thumbnailMaxSize;
      },
      thumbnailHeight() {
        if (!this.webResource.ebucoreHeight || !this.thumbnailWidth) {
          return null;
        }
        return (this.webResource.ebucoreHeight / this.webResource.ebucoreWidth) * this.thumbnailWidth;
      },
      edmTypeWithFallback() {
        return this.webResource.edmType || this.edmType;
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
        max-height: $swiper-height;
      }

      @media (min-height: $bp-medium) {
        max-height: $swiper-height-max;
      }

      @media (max-width: $bp-medium) {
        max-height: $swiper-height-medium;
      }
    }
  }
</style>
