<template>
  <div />
</template>

<script>
  export default {
    name: 'AccountCallbackPage',
    middleware: [
      'cache-control-private'
    ],
    auth: false,
    layout: 'minimal'
  };
</script>
