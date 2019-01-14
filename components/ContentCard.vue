<template>
  <b-card
    :title="cardTitle"
    :img-src="imageUrl"
    img-alt="This is an image"
    img-top
    footer="Creator of this object"
    class="mb-4">
    <h4>{{ contentSource }}</h4>
    <a :href="url">
      Read more
    </a>
  </b-card>
</template>

<script>
  export default {
    props: {
      cardTitle: {
        type: String,
        default: 'Content'
      },
      contentSource: {
        type: String,
        default: 'External Link'
      },
      url: {
        type: String,
        default: 'http://www.europeana.eu'
      },
      imageUrl: {
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
