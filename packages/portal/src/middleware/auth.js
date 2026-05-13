export default ({ $auth, redirect, route }) => {
  console.log('auth middleware');
  if (!$auth.user.loggedIn) {
    redirect({ name: 'account-login', query: { redirect: route.fullPath } });
  }
};
