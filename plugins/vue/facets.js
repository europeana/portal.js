function tFacetName(facetName, count = 1) {
  const themeLabel = (facetName, count) => {
    const theme = this.$store.getters['search/theme'];
    if (theme) return this.$tcNull(`themes.${theme}.facets.${facetName}.name`, count);
  };

  const genericLabel = (facetName, count) => {
    return this.$tcNull(`facets.${facetName}.name`, count);
  };

  const facetNameKey = facetName.replace('.', '/');
  return themeLabel(facetNameKey, count) || genericLabel(facetNameKey, count) || facetName;
}

export default {
  install(Vue) {
    Vue.prototype.$tFacetName = tFacetName;
  }
};
