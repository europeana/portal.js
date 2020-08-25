<template>
  <div />
</template>

<script>
  export default {
    auth: true,
    layout: 'minimal',
    middleware: [
      'auth',
      ({ app }) => {
        const path = app.$auth.strategies.keycloak.options.end_session_endpoint;
        app.$goto(`${path}?redirect_uri=${encodeURIComponent(window.location.origin)}`);
      }
    ]
  };
  </script>
