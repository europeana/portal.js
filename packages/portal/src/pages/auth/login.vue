<template>
  <div />
</template>

<script>
  export default {
    name: 'AccountLoginPage',

    mounted() {
      this.$auth.login({ replace: true });
    }
  };
</script>
