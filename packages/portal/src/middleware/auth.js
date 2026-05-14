export default ({ $auth, redirect, route }) => {
  if (!$auth.user.loggedIn) {
    redirect({ name: 'account-login', query: { redirect: route.fullPath } });
  }
};
