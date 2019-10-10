<template>
  <b-row class="flex-md-row border-top pt-3">
    <b-col
      v-if="tags.length > 0"
      cols="9"
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
      cols="3"
      data-qa="blog share"
    >
      <strong>Share:</strong>
    </b-col>
  </b-row>
</template>

<script>
  export default {
    name: 'TagAndsHARE',

    props: {
      tags: {
        type: Array,
        default: null
      }
    }
  };
</script>

<style lang="scss" scoped>
  .badge:not(:last-child) {
    margin-right: .3rem;
  }
</style>
