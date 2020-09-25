<template>
  <SmartLink
    :destination="url"
    data-qa="call to action"
    class="cta-button d-inline-flex align-items-center"
  >
    {{ text }}
  </SmartLink>
</template>

<script>
  import SmartLink from '../../components/generic/SmartLink';
  export default {
    components: {
      SmartLink
    },
    props: {
      url: {
        type: String,
        default: ''
      },
      text: {
        type: String,
        default: ''
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import './assets/scss/variables.scss';
  @import './assets/scss/icons.scss';

  .cta-button {
    display: block;
    margin: 2rem auto;
    padding: 0.5rem 1rem;
    color: $white;
    font-size: $font-size-small;
    text-transform: uppercase;
    border-radius: $border-radius-small;
    box-shadow: $boxshadow-light;
    background-color: $blue;
    border: none;
    text-decoration: none;
  }
</style>
