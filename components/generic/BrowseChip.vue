<template>
  <div>
    <b-badge
      to="#"
      pill
      variant="nocolor"
      class="mb-3 mr-3 font-weight-normal bg-transparent"
    >
      Maps
    </b-badge>
    <b-badge
      to="#"
      pill
      variant="nocolor"
      class="mb-3 mr-3 font-weight-normal bg-transparent"
    >
      Painting
    </b-badge>
    <b-badge
      to="#"
      pill
      variant="nocolor"
      class="mb-3 mr-3 font-weight-normal bg-transparent"
    >
      Sculpture
    </b-badge>
  </div>
</template>

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
