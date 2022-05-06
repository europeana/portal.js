<template>
  <div
    class="image-container h-100"
  >
    <b-link
      v-if="imageLink && media.thumbnails.large && !media.isShownAt"
      :href="imageLink"
      target="_blank"
      data-qa="media link"
    >
      <MediaDefaultThumbnail
        v-if="showDefaultThumbnail"
        media-type="image"
        data-qa="default thumbnail"
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
      v-else-if="media.thumbnails.large"
    >
      <MediaDefaultThumbnail
        v-if="showDefaultThumbnail"
        media-type="image"
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
  export default {
    name: 'MediaCardImage',

    components: {
      MediaDefaultThumbnail: () => import('../media/MediaDefaultThumbnail')
    },

    props: {
      media: {
        type: Object,
        default: null
      },
      lazy: {
        type: Boolean,
        default: true
      },
      europeanaIdentifier: {
        type: String,
        default: ''
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
      thumbnailSrc() {
        return this.media.thumbnails.large;
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
@import '@/assets/scss/variables';

.image-container {
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-height: $bp-small) {
    align-items: flex-start;
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
