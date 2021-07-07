<template>
  <div
    class="image-container h-100"
  >
    <b-link
      v-if="imageLink && media.thumbnails['large'] && !media.isShownAt"
      :href="imageLink"
      target="_blank"
    >
      <component
        :is="lazy ? 'b-img-lazy' : 'b-img'"
        :src="media.thumbnails['large']"
        class="w-auto"
        alt=""
        data-qa="media preview image"
      />
      <span
        class="sr-only"
      >
        ({{ $t('newWindow') }})
      </span>
    </b-link>
    <div
      v-else-if="media.thumbnails['large']"
    >
      <component
        :is="lazy ? 'b-img-lazy' : 'b-img'"
        :src="media.thumbnails['large']"
        alt=""
        class="mw-100"
        data-qa="media preview image"
      />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MediaCardImage',
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
    computed: {
      imageLink() {
        return this.$apis.record.mediaProxyUrl(this.media.about, this.europeanaIdentifier, { disposition: 'inline' });
      }
    }
  };
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables.scss';

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
