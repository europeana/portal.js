<template>
  <div>
    <!-- update to a routerlink -->
    <b-badge
      v-for="entity in relatedEntities"
      :key="entity.link"
      :href="entity.link"
      pill
      variant="nocolor"
      class="mb-3 mr-3 font-weight-normal bg-transparent"
    >
      {{ entity.title }}
    </b-badge>
  </div>
</template>

<script>
  export default {
    props: {
      relatedEntities: {
        type: Array,
        default: () => []
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
