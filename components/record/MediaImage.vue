<template>
  <b-link
    v-if="link && src"
    :href="link"
    target="_blank"
  >
    <b-img-lazy
      :src="src"
      class="mw-100"
      alt=""
      data-qa="media preview image"
    />
    {{ linkText }}
    <span
      class="sr-only"
    >
      ({{ $t('newWindow') }})
    </span>
  </b-link>
  <b-img-lazy
    v-else-if="!link && src"
    :src="src"
    alt=""
    class="mw-100"
    data-qa="media preview image"
  />
</template>

<script>
  export default {
    props: {
      link: {
        type: String,
        default: ''
      },
      mediaType: {
        type: String,
        default: ''
      },
      src: {
        type: String,
        default: ''
      }
    },

    computed: {
      linkText() {
        if (this.mediaType === 'pdf') {
          return this.$t('record.view.pdf');
        } else if (this.mediaType === 'image') {
          return this.$t('record.view.image');
        } else {
          return this.$t('record.view.media');
        }
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
