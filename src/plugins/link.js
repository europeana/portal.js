const plugin = {
  to(path, query = {}) {
    if (path.includes('://')) {
      return null;
    } else {
      return {
        path,
        query
      };
    }
  },

  href(path, query = {}) {
    if (path.includes('://')) {
      const url = new URL(path);
      url.search = new URLSearchParams(query).toString();
      return url.toString();
    } else {
      return null;
    }
  }
};

export default (context, inject) => {
  inject('link', plugin);
};
