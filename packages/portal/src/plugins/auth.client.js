export default (ctx, inject) => {
  // console.log('auth.client plugin');
  // console.log('$auth plugin', ctx.$auth);
  return

  inject('eauth', {
    options: {
      redirect: {
        login: null
      }
    },
    loggedIn: false,
    login() {

    },
    logout() {

    },
    userHasClientRole() {

    },
    $storage: {
      getUniversal() {

      },
      removeUniversal() {

      },
      setUniversal() {

      }
    },
    getToken() {

    },
    setRefreshToken() {

    },
    setToken() {

    },
    getRefreshToken() {

    },
    request() {

    },
    strategies: {
      keycloak: {
        options: {
          end_session_endpoint: null
        }
      }
    },
    strategy: {
      name: null,
      options: {
        client_id: null,
        realm: null,
        origin: null
      },
      _setToken() {

      }
    },
    user: {
      // email: null,
      // sub: null
    }

  })
};
