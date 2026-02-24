<template>
  <div />
</template>

<script>
  import { createCacheControlMiddleware } from '@/middleware/cache-control.js';

  export default {
    name: 'AccountLoginPage',

    layout: 'minimal',

    middleware: [
      createCacheControlMiddleware('accountLogin')
    ],

    created() {
      if (process.client) {
        this.$keycloak.login({ replace: true });
      }
    },

    mounted() {
      this.$keycloak.login({ replace: true });
    }
  };
</script>
