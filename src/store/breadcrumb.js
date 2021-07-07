export const state = () => ({
  data: null
});

export const mutations = {
  setBreadcrumbs(state, values) {
    if (!values) {
      return;
    }
    const breadcrumb = values;

    state.data = breadcrumb;
  },

  clearBreadcrumb(state) {
    state.data = null;
  }
};
