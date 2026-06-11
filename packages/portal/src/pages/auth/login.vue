<template>
  <div />
</template>

<script>
  export default {
    name: 'AuthLoginPage',

    layout: 'minimal',

    mounted() {
      this.$auth.login();
    }
  };
</script>
