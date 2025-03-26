export default ({ redirect, store }) => {
  if (!store.state.keycloak.loggedIn) {
    redirect({ name: 'account-login' });
  }
};
