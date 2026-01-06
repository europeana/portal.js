<template>
  <b-alert
    show
    variant="light"
    :class="variant === 'icon' ? 'with-icon d-flex' : ''"
    data-qa="info notice"
  >
    <span
      v-if="variant === 'icon'"
      class="icon-info d-inline-flex"
    />
    <!-- @slot Message text -->
    <slot />
  </b-alert>
</template>

<script>
  import { BAlert } from 'bootstrap-vue';

  /**
   * Information/notification alert message.
   */
  export default {
    name: 'InfoMessage',

    components: {
      BAlert
    },

    props: {
      /**
       * Style variant to use
       * @values icon, default
       */
      variant: {
        type: String,
        default: 'default'
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .alert.alert-light {
    color: $greyblack;
    font-style: italic;

    &.with-icon {
      font-style: normal;

      .icon-info {
        padding-right: 0.75rem;
        font-size: $font-size-large;
        color: $blue;

        @media (min-width: $bp-4k) {
          font-size: $font-size-large-4k;
        }
      }
    }
  }
</style>

<docs lang="md">
  Variant "default":
  ```jsx
  <InfoMessage>
    Hello default!
  </InfoMessage>
  ```

  Variant "icon":
  ```jsx
  <InfoMessage
    variant="icon"
  >
    Hello icon!
  </InfoMessage>
  ```
</docs>
