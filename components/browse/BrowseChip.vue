<template>
  <li>
    <b-badge
      v-if="title"
      :to="linkTo"
      pill
      variant="nocolor"
      class="mb-3 mr-3 font-weight-normal bg-transparent"
      data-qa="browse chip"
    >
      {{ title }}
    </b-badge>
  </li>
</template>

<script>
  export default {
    props: {
      linkTo: {
        type: [String, Object],
        required: true
      },
      title: {
        type: String,
        default: ''
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "./assets/scss/variables.scss";

  .badge-nocolor {
    border: 1px solid $mediumgrey;
    color: $black;
    font-size: $font-size-small;
    height: 4rem;
    line-height: 3.5rem;
    min-width: 6rem;
  }
</style>
