export default ({ $keycloak, redirect, route }) => {
  console.log('auth middleware');
  if (!$keycloak.loggedIn) {
    redirect({ name: 'account-login', query: { redirect: route.fullPath } });
  }
};
