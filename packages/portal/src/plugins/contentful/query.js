export default ({ $axios } = {}) => (alias, variables) => {
  return $axios.post(`/_api/contentful/graphql/${alias}`, variables);
};
