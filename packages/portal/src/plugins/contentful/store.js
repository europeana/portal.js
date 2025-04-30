const acceptedMediaTypes = (req) => {
  return (req.headers.accept || '')
    .split(',')
    .map((accept) => accept.split(';')[0])
    .filter((accept) => accept !== '*/*');
};

export default {
  namespaced: true,

  state: () => ({
    acceptedMediaTypes: []
  }),

  mutations: {
    setAcceptedMediaTypes(state, req) {
      state.acceptedMediaTypes = acceptedMediaTypes(req);
    }
  }
};
