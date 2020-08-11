<template>
  <div />
</template>

<script>
  export default {
    auth: true,
    layout: 'minimal',
    middleware: [
      'auth',
      ({ $auth, store }) => {
        store.dispatch('set/reset');
        $auth.logout();
      }
    ]
  };
  </script>
