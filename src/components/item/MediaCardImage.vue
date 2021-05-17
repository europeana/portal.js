<template>
  <div
    class="h-100 d-flex align-items-center justify-content-center"
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
    <component
      :is="lazy ? 'b-img-lazy' : 'b-img'"
      v-else-if="media.thumbnails['large']"
      :src="media.thumbnails['large']"
      alt=""
      class="mw-100"
      data-qa="media preview image"
    />
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

img {
  max-height: 100%;
  height: auto;
}
</style>
