import { getCurrentInstance } from 'vue';

export default function useBootstrapVueHelpers() {
  const instance = getCurrentInstance();
  const $root = instance.proxy.$root;

  const makeToast = (message, options = {}) => {
    const defaults = {
      autoHideDelay: 5000,
      isStatus: true,
      noCloseButton: true,
      solid: true,
      toastClass: 'brand-toast',
      toaster: 'b-toaster-bottom-left'
    };
    $root.$bvToast?.toast(message, { ...defaults, ...options });
  };

  return {
    makeToast
  };
}
