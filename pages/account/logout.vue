<template>
  <div />
</template>

<script>
  export default {
    auth: true,
    layout: 'minimal',
    middleware: [
      'auth',
      ({ $auth }) => {
        $auth.logout();
      }
    ]
  };
</script>
