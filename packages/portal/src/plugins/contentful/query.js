// TODO: function to make $axios request to local server middleware for CTF

export default ({ $axios } = {}) => (alias, variables) => {
  return $axios.get(`/_api/contentful/graphql/${alias}`, { params: variables });
};
