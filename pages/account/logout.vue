<template>
  <div />
</template>

<script>
  export default {
    auth: true,
    layout: 'default',
    middleware: 'auth',
    mounted() {
      this.$auth.logout();
    }
  };
</script>
