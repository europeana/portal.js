<template>
  <b-link
    v-if="imageLink && imageSrc"
    :href="imageLink"
    target="_blank"
  >
    <b-img-lazy
      :src="imageSrc"
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
    v-else-if="!imageLink && imageSrc"
    :src="imageSrc"
    alt=""
    class="mw-100"
    data-qa="media preview image"
  />
</template>

<script>
  // import { isImage } from '../../plugins/media';

  export default {
    props: {
      about: {
        type: String,
        default: ''
      },
      europeanaIdentifier: {
        type: String,
        default: ''
      },
      imageSrc: {
        type: String,
        default: ''
      }
    },

    computed: {
      imageLink() {
        return this.$proxyMedia(this.about, this.europeanaIdentifier, { disposition: 'inline' });
      }
    }
  };
</script>

<style lang="scss" scoped>
  img {
    height: 100%;
  }
</style>
