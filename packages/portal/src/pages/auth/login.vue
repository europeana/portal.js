<template>
  <div />
</template>

<script>
  export default {
    name: 'AuthLoginPage',

    mounted() {
      this.$auth.login(this.$route.query?.redirect || this.localePath('/'));
    }
  };
</script>
