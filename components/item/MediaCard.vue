<template>
  <b-link
    v-if="imageLink && imageSrc"
    :href="imageLink"
    target="_blank"
  >
    <b-img-lazy
      :src="imageSrc"
      class="mw-100"
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
  import { isPDF, isImage } from '../../plugins/media';

  export default {
    props: {
      europeanaIdentifier: {
        type: String,
        default: ''
      },
      media: {
        type: Object,
        default: () => {}
      },
      imageSrc: {
        type: String,
        default: ''
      }
    },

    computed: {
      imageLink() {
        if (!this.media.about) {
          return false;
        }
        return isImage(this.media) ? this.$proxyMedia(this.media.about, this.europeanaIdentifier, { disposition: 'inline' }) : this.media.about;
      }
    }
  };
</script>

<style lang="scss" scoped>
  img {
    display: block;
    margin: 0 auto;
  }
</style>
