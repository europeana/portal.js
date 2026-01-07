import { computed, getCurrentInstance, ref } from 'vue';

export const useSelectedItems = (selectedValue) => {
  const instance = getCurrentInstance();

  if (!instance.proxy.$root.$selectedItems) {
    instance.proxy.$root.$selectedItems = ref([]);
  }

  const selected = instance.proxy.$root.$selectedItems;

  if (selectedValue) {
    selected.value = selectedValue;
  }

  const select = (itemId) => {
    if (!selected.value.includes(itemId)) {
      selected.value.push(itemId);
    }
  };

  const deselect = (itemId) => {
    selected.value = selected.value.filter((id) => id !== itemId);
  };

  const clear = () => {
    selected.value = [];
  };

  return {
    clear,
    deselect,
    selected: computed(() => selected.value),
    select
  };
};
