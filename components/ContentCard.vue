<template>
  <b-card
    :title="name"
    :img-src="imageUrl"
    :img-alt="imageTitle"
    img-top
    footer="Creator of this object"
    class="mb-4"
  >
    <b-link :href="url">
      Read more
    </b-link>
  </b-card>
</template>

<script>
  export default {
    props: {
      name: {
        type: String,
        default: 'Content'
      },
      url: {
        type: String,
        default: 'https://www.europeana.eu/'
      },
      imageUrl: {
        type: String,
        default: ''
      },
      imageTitle: {
        type: String,
        default: ''
      }
    }
  };
</script>

<style lang="scss">
  .card-img-top {
    max-height: 10rem;
  }
</style>
