import { getCurrentInstance } from 'vue';

export default function useHideTooltips(ids) {
  const instance = getCurrentInstance();
  const $root = instance.proxy.$root;

  const hideTooltips = () => {
    for (const id of [].concat(ids)) {
      $root.$emit('bv::hide::tooltip', id);      
    }
  };

  return {
    hideTooltips
  };
}
