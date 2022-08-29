<template>
  <div class="error-message">
    <b-img
      :src="illustrationSrc"
    />
    <p>{{ error }}</p>
  </div>
</template>

<script>
  export default {
    name: 'ErrorMessage',

    props: {
      variant: {
        type: String,
        required: true
      },
      error: {
        type: Object,
        default: null
      }
    },

    computed: {
      illustrationSrc() {
        let src;
        switch (this.variant) {
        case ('item not found'):
          src = require('@/assets/img/illustrations/il-item-not-found.svg');
          break;
        }
        return src;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  .error-message {
    padding: 10rem 1rem;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
  }
</style>
