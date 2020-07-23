<template>
  <b-badge
    :to="linkTo"
    pill
    variant="light"
    class="mt-1 mr-2 font-weight-normal bg-white"
    :class="{ 'img-chip': img }"
    data-qa="related chip"
  >
    <b-img
      v-if="img"
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
      to: {
        type: String,
        default: ''
      },
      linkTo: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        required: true
      },
      id: {
        type: String,
        default: ''
      },
      img: {
        type: String,
        default: ''
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import './assets/scss/variables.scss';
  .badge-light {
    color: $black;
    font-size: $font-size-small;
    border-radius: 1.125rem;
    border: solid 1px $lightbluemagenta;
    padding: 0.25rem 0.75rem;
    margin-bottom: 2rem;
    height: 2.25rem;
    min-width: 4rem;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    transition: $standard-transition;
    &:hover, &:focus {
      background: $lightbluemagenta !important;
    }
    &.img-chip {
      padding: 0.25rem 0.75rem 0.25rem 0.25rem;
    }

    img {
      width: 28px;
      height: 28px;
    }
    @media (max-width: $bp-large) {
      margin-bottom: 0.25rem;
    }
  }
</style>
