<template>
  <b-row class="flex-md-row border-top border-bottom py-3">
    <b-col
      v-if="tags.length > 0"
      cols="10"
      data-qa="blog tags"
    >
      <strong>Tags:</strong>
      <!-- We will need URLS for the tags -->
      <a
        v-for="(tag, index) in tags"
        :key="index"
        href="#"
        class="badge badge-secondary"
      >
        {{ tag }}
      </a>
    </b-col>
    <b-col
      cols="2"
      data-qa="blog share"
    >
      <strong>Share:</strong>
      <a
        href=""
        class="social-media-icon"
      >
        <span class="icon icon-facebook" />
        <span class="sr-only">Facebook</span>
      </a>
      <a
        href=""
        class="social-media-icon"
      >
        <span class="icon icon-twitter" />
        <span class="sr-only">Twitter</span>
      </a>
    </b-col>
  </b-row>
</template>

<script>
  export default {
    name: 'TagAndsHARE',

    props: {
      tags: {
        type: Array,
        required: true
      }
    }
  };
</script>

<style lang="scss" scoped>
  .badge:not(:last-child) {
    margin-right: .3rem;
  }

  .social-media-icon {
    padding: .2rem;
    display: inline-flex;

    &:hover {
      text-decoration: none;
    }
  }
</style>
