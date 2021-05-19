<template>
  <div />
</template>

<script>
  import login from '../../mixins/login';

  export default {
    layout: 'minimal',

    mixins: [
      login
    ],

    mounted() {
      this.login();
    }
  };
</script>
