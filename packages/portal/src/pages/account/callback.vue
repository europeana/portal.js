<template>
  <div />
</template>

<script>
  export default {
    name: 'AccountCallbackPage',
    layout: 'minimal',
    middleware: [
      'cache-control-private'
    ],
    auth: false
  };
</script>
