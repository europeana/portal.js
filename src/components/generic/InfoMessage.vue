<template>
  <b-alert
    v-if="variant === 'icon'"
    show
    variant="light"
    data-qa="info notice"
    class="with-icon d-flex"
  >
    <span class="icon-info d-inline-flex" />
    {{ message }}
  </b-alert>
  <b-alert
    v-else
    show
    variant="light"
    data-qa="info notice"
  >
    {{ message }}
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
       * Message to display
       */
      message: {
        type: String,
        default: ''
      },
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
  @import '@/assets/scss/variables';

  .alert.alert-light {
    font-style: italic;

    &.with-icon {
      font-style: normal;

      .icon-info {
        padding-right: 0.75rem;
        font-size: 24px;
        color: $blue;
      }
    }
  }

  .alert-light {
    color: $black;
  }
</style>

<docs lang="md">
  Variant "default":
  ```jsx
  <InfoMessage
    message="Hello."
  />
  ```

  Variant "icon":
  ```jsx
  <InfoMessage
    message="Hello."
    variant="icon"
  />
  ```
</docs>
