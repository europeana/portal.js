export const state = () => ({
  data: null
});

export const mutations = {
  setBreadcrumb(state, value) {
    if (!value) return;
    const breadcrumb = [ { text:  this.app.i18n.t('blog.blog'), href: '/blog' } ];
    breadcrumb.push(value);

    state.data = breadcrumb;
  },

  clearBreadcrumb(state) {
    state.data = null;
  }
};
