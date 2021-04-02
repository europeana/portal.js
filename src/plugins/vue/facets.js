function tFacetName(facetName, count = 1) {
  const collectionLabel = (facetName, count) => {
    const collection = this.$store.getters['search/collection'];
    if (collection) {
      return this.$tcNull(`collections.${collection}.facets.${facetName}.name`, count);
    }
  };

  const genericLabel = (facetName, count) => {
    return this.$tcNull(`facets.${facetName}.name`, count);
  };

  const facetNameKey = facetName.replace(/\..*$/, '');
  return collectionLabel(facetNameKey, count) || genericLabel(facetNameKey, count) || facetNameKey;
}

export default {
  install(Vue) {
    Vue.prototype.$tFacetName = tFacetName;
  }
};
