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
        window.location.replace(`${path}?redirect_uri=${encodeURIComponent(window.location.origin)}`);
        // Trigger event to force possibly other open tabs of the portal to refresh after logout
        localStorage.setItem('logout-event', `logout-${Math.random()}`);
      }
    ]
  };
  </script>
