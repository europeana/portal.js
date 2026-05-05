<template>
  <div />
</template>

<script>
  export default {
    name: 'AccountKallbackPage',
    layout: 'minimal',
    mounted() {
      console.log('kallback');
      this.$keycloak.callback();
    }

  };
</script>
