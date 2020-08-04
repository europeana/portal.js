<template>
  <b-link
    v-if="imageLink && media.thumbnails['large']"
    :href="imageLink"
    target="_blank"
  >
    <b-img-lazy
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
  <b-img-lazy
    v-else-if="!imageLink && media.thumbnails['large']"
    :src="media.thumbnails['large']"
    alt=""
    class="mw-100"
    data-qa="media preview image"
  />
</template>

<script>

  export default {
    name: 'MediaCardImage',
    props: {
      media: {
        type: Object,
        default: null
      },
      europeanaIdentifier: {
        type: String,
        default: ''
      }
    },
    computed: {
      imageLink() {
        return this.$proxyMedia(this.media.about, this.europeanaIdentifier, { disposition: 'inline' });
      }
    }
  };
</script>
