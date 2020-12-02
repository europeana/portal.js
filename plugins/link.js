const plugin = {
  to(route) {
    return this.href(route) === null ? route : null;
  },
  href(route) {
    return (typeof route === 'string' && route.includes('://')) ? route : null;
  }
};

export default (context, inject) => {
  inject('link', plugin);
};
