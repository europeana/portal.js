<template>
  <b-card
    :title="name"
    :img-src="imageUrl"
    :img-alt="imageTitle"
    img-top
    footer="Creator of this object"
    class="mb-4"
    data-qa="content card"
  >
    <p class="card-text">
      {{ description }}
    </p>
    <a
      :href="url"
      class="card-link"
    >
      Read more
    </a>
  </b-card>
</template>

<script>
  export default {
    props: {
      name: {
        type: String,
        default: 'Content'
      },
      description: {
        type: String,
        default: ''
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
