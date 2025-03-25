import { computed } from 'vue';

export function useCardinality(value) {
  const cardinality = computed(() => Array.isArray(value) ? 'many' : '1');

  return { cardinality };
}
