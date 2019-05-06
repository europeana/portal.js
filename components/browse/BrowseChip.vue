<template>
  <b-badge
    v-if="entity"
    :to="entity.link"
    pill
    variant="nocolor"
    class="mb-3 mr-3 font-weight-normal bg-transparent"
    data-qa="browse chip"
  >
    {{ entity.title }}
  </b-badge>
</template>

<script>
  export default {
    props: {
      entity: {
        type: Object,
        default: () => {}
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
