<template>
  <b-alert
    v-if="variant === 'icon'"
    show
    variant="light"
    data-qa="info notice"
    class="withIcon d-flex"
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

  export default {
    components: {
      BAlert
    },
    props: {
      message: {
        type: String,
        default: ''
      },
      variant: {
        type: String,
        default: ''
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  .alert.alert-light {
    font-style: italic;

    &.withIcon {
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
