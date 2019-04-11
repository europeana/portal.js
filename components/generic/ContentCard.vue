<template>
  <b-card
    class="mb-4 text-left"
    data-qa="content card"
  >
    <b-card-img-lazy
      :src="imageUrl"
      :alt="imageTitle"
      top
    />
    <b-card-title>
      {{ name }}
    </b-card-title>
    <b-card-text>
      {{ description }}
      <a
        :href="url"
        class="card-link"
      >
        Read more
      </a>
    </b-card-text>
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
  @import "./assets/scss/variables.scss";

  .card-img-top {
    max-height: 10rem;
  }

  .card {
    background: $extralightgrey;
    border-radius: $border-radius-small;
    box-shadow: $boxshadow-small;
    color: $black;
    font-size: $font-size-extrasmall;
    line-height: 1.1875rem;
    transition: box-shadow 0.25s;

    &:hover {
      box-shadow: 0 4px 12px 0 rgba(0,0,0,0.4)
    }

    .card-body {
      padding: 0;
    }

    .card-title {
      font-size: $font-size-small;
      font-weight: normal;
    }

    .card-title,
    .card-text {
      padding: 1rem;
    }

  }
</style>
