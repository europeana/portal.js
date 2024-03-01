export default {
  methods: {
    linkToRoute(path, query = {}) {
      if (!path) {
        return null;
      } else if (path.includes('://')) {
        return null;
      } else {
        return {
          path,
          query
        };
      }
    },

    linkHrefUrl(path, query = {}) {
      if (!path) {
        return null;
      } else if (path.includes('://')) {
        const url = new URL(path);
        url.search = new URLSearchParams(query).toString();
        return url.toString();
      } else {
        return null;
      }
    }
  }
};
