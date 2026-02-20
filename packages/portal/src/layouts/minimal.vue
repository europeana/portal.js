<template>
  <main role="main">
    <nuxt
      id="main"
    />
  </main>
</template>

<script>
  export default {
    name: 'MinimalLayout',

    middleware: [
      'cache-control/private'
    ]
  };
</script>

<style lang="scss" scoped>
  main {
    min-height: initial;
  }
</style>
