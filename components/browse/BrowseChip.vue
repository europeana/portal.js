<template>
  <b-badge
    v-if="title"
    :to="{ name: 'entity-type-all', params: { type: type, pathMatch: path }}"
    pill
    variant="nocolor"
    class="mb-3 mr-3 font-weight-normal bg-transparent"
    data-qa="browse chip"
  >
    {{ title }}
  </b-badge>
</template>

<script>
  export default {
    props: {
      path: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: ''
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "./assets/scss/variables.scss";

  .badge-nocolor {
    border: 1px solid $darkgrey;
    color: $black;
    font-size: 0.875rem;
    height: 4rem;
    line-height: 3.5rem;
    min-width: 6rem;
  }
</style>
