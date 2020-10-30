export default {
  namespaced: true,

  state: () => ({
    requests: [],
    recording: false
  }),

  mutations: {
    start(state) {
      state.recording = true;
    },
    stop(state) {
      state.recording = false;
    },
    push(state, request) {
      state.requests.push(request);
    },
    reset(state) {
      state.requests = [];
    }
  }
};
