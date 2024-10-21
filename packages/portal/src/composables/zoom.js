import { computed, ref } from 'vue';

const min = ref(0);
const max = ref(0);
const def = ref(0);
const current = ref(0);

const setCurrent = (value) => {
  current.value = value;
};
const setDefault = (value) => {
  def.value = value;
};
const setMin = (value) => {
  min.value = value;
};
const setMax = (value) => {
  max.value = value;
};
const zoomIn = () => {
  current.value = Math.min(max.value, current.value + 1);
};
const zoomOut = () => {
  current.value = Math.max(min.value, current.value - 1);
};
const reset = () => {
  current.value = def.value;
};

const atDefault = computed(() => {
  return current.value === def.value;
});
const atMax = computed(() => {
  return current.value >= max.value;
});
const atMin = computed(() => {
  return current.value <= min.value;
});

export default function useZoom() {
  return {
    atMax,
    atMin,
    atDefault,
    current,
    reset,
    setCurrent,
    setDefault,
    setMin,
    setMax,
    zoomIn,
    zoomOut
  };
}
