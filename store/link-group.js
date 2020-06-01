export const state = () => ({
  data: {}
});

export const mutations = {
  setLinks(state, payload) {
    for (const identifier of ['mainNavigation', 'footerMoreInfo', 'footerHelp']) {
      const linkGroup = payload[identifier].items[0];
      state.data[identifier] = {
        name: linkGroup.name ? linkGroup.name : null,
        links: linkGroup.links.items
      };
    }
  }
};
