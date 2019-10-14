export const state = () => ({
  breadcrumb: null
});

export const mutations = {
  setBreadcrumb(state, value) {
    console.log('VALUE', value);
    state.breadcrumb = value;
  }
};
