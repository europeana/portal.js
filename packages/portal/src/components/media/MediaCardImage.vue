<template>
  <div
    class="image-container h-100"
  >
    <b-link
      v-if="imageLink && thumbnails.large && !media.forEdmIsShownAt"
      :href="imageLink"
      target="_blank"
      data-qa="media link"
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
        data-qa="media preview image"
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
        data-qa="media preview image"
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
        return this.thumbnails.large;
      },
      thumbnailWidth() {
        if (!this.media.ebucoreWidth) {
          return null;
        }
        if (this.media.ebucoreWidth < 400) {
          return this.media.ebucoreWidth;
        }
        return 400;
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

<style lang="scss" scoped>
@import '@europeana/style/scss/variables';

.image-container {
  display: flex;
  align-items: center;
  justify-content: center;

  a {
    text-decoration: none;
  }
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
</style>
