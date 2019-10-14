export const state = () => ({
  data: null
});

export const mutations = {
  setBreadcrumb(state, value) {
    const breadcrumb = [ { text: 'Blog', href: '#' } ];
    breadcrumb.push(value);

    state.data = breadcrumb;
  }
};
