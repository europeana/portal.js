<template>
  <b-row class="flex-md-row py-3">
    <b-col
      v-if="tags.length > 0"
      cols="10"
      data-qa="blog tags"
    >
      <strong>Tags:</strong>
      <!-- We will need URLS for the tags -->
      <span
        v-for="(tag, index) in tags"
        :key="index"
        class="badge badge-secondary"
      >
        {{ tag }}
      </span>
    </b-col>
  </b-row>
</template>

<script>
  export default {
    name: 'TagAndShare',

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
</style>
