import { computed, getCurrentInstance, ref } from 'vue';

export const useSelectedItems = (selectedValue) => {
  const instance = getCurrentInstance();
  const context = instance.proxy.$root.context;

  if (!context.$selectedItems) {
    // add it to the context to make it SSR-safe, albeit coupled to nuxt
    context.$selectedItems = ref([]);
  }

  if (selectedValue) {
    context.$selectedItems.value = selectedValue;
  }

  const select = (itemId) => {
    if (!context.$selectedItems.value.includes(itemId)) {
      context.$selectedItems.value.push(itemId);
    }
  };

  const deselect = (itemId) => {
    context.$selectedItems.value = context.$selectedItems.value.filter((id) => id !== itemId);
  };

  const clear = () => {
    context.$selectedItems.value = [];
  };

  return {
    clear,
    deselect,
    selected: computed(() => context.$selectedItems.value),
    select
  };
};
