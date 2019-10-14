export const state = () => ({
  data: null
});

export const mutations = {
  setBreadcrumb(state, value) {
    const breadcrumb = [ { text:  this.app.i18n.t('blog.blog'), href: '#' } ];
    breadcrumb.push(value);

    state.data = breadcrumb;
  }
};
