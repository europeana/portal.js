export const state = () => ({
  itemId: null
});

export const mutations = {
  setModalData(state, data) {
    state.itemId = data;
  }
};
