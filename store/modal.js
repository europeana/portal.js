export const state = () => ({
  modalData: null
});

export const mutations = {
  setModalData(state, data) {
    state.modalData = data;
  }
};
