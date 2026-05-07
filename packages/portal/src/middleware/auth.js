export default ({ $auth, redirect, route }) => {
  console.log('auth middleware');
  if (!$auth.loggedIn) {
    redirect({ name: 'account-login', query: { redirect: route.fullPath } });
  }
};
