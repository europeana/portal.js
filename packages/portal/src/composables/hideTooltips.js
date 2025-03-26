import { getCurrentInstance } from 'vue';

export default function useHideTooltips() {
  const instance = getCurrentInstance();
  const $root = instance.proxy.$root;

  const hideTooltips = () => {
    $root.$emit('bv::hide::tooltip');
  };

  return {
    hideTooltips
  };
}
