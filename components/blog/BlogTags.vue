<template>
  <b-row class="flex-md-row py-3">
    <b-col
      v-if="tags.length > 0"
      data-qa="blog tags"
      class="d-flex"
    >
      <span class="icon-ic-tag" />
      <div>
        <b-badge
          v-for="(tag, index) in tags"
          :key="index"
          variant="outline-light"
        >
          {{ tag }}
        </b-badge>
      </div>
    </b-col>
  </b-row>
</template>

<script>
  export default {
    name: 'BlogTags',

    props: {
      tags: {
        type: Array,
        required: true
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import './assets/scss/variables.scss';

  .icon-ic-tag {
    color: $mediumgrey;
    display: inline-block;
    font-size: 1.5rem;
    padding-top: 0.25rem;
  }

  .badge {
    margin: 0 0.25rem 0.5rem;
  }

</style>
