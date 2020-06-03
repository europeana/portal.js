<template>
  <b-badge
    v-if="title"
    :to="linkTo"
    pill
    variant="light"
    class="mt-1 mr-2 font-weight-normal bg-white"
    data-qa="browse chip"
  >
    <b-img
      :src="img"
      alt=""
      rounded="circle"
      class="mr-2"
    />
    {{ title }}
  </b-badge>
</template>

<script>
  export default {
    name: 'RelatedChip',

    props: {
      linkTo: {
        type: [String, Object],
        required: true
      },
      title: {
        type: String,
        default: () => {}
      },
      img: {
        type: String,
        default: () => {}
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "./assets/scss/variables.scss";
  .badge-light {
    color: $black;
    font-size: $font-size-small;
    border-radius: 1.125rem;
    box-shadow: $boxshadow-light;
    padding: 0.25rem 0.75rem 0.25rem 0.25rem;
    margin-bottom: 2.5rem;

    img {
      width: 28px;
      height: 28px;
    }
  }
</style>
