// TODO: function to make $axios request to local server middleware for CTF

export default ({ $axios } = {}) => (alias, variables) => {
  return $axios.post(`/_api/contentful/graphql/${alias}`, variables);
};
