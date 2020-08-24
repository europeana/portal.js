<template>
  <div />
</template>

<script>
  export default {
    auth: true,
    layout: 'minimal',
    middleware: [
      'auth',
      ({ store }) => {
        store.dispatch('set/reset');
        store.$goto(`${process.env.OAUTH_ORIGIN}/auth/realms/${process.env.OAUTH_REALM}/protocol/openid-connect/logout?redirect_uri=${encodeURIComponent(window.location.origin)}`);
      }
    ]
  };
  </script>
