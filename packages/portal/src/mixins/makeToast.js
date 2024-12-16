export default {
  methods: {
    makeToast(message, options = {}) {
      const defaults = {
        autoHideDelay: 5000,
        isStatus: true,
        noCloseButton: true,
        solid: true,
        toastClass: 'brand-toast',
        toaster: 'b-toaster-bottom-left'
      };
      this.$root.$bvToast.toast(message, { ...defaults, ...options });
    }
  }
};
