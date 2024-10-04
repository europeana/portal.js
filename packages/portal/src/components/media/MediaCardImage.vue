<template>
  <div
    class="media-card-image h-100"
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
    <div
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
    </div>
  </div>
</template>

<script>
  import WebResource from '@/plugins/europeana/edm/WebResource';

  export default {
    name: 'MediaCardImage',

    components: {
      MediaDefaultThumbnail: () => import('../media/MediaDefaultThumbnail')
    },

    props: {
      media: {
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
        return this.media.thumbnails(this.$nuxt.context);
      },
      thumbnailSrc() {
        return this.thumbnails[this.thumbnailSize];
      },
      thumbnailWidth() {
        if (!this.media.ebucoreWidth) {
          return null;
        }
        const thumbnailMaxSize = this.thumbnailSize === 'large' ? 400 : 200;
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
