import { onMounted, readonly, ref, nextTick } from 'vue';

export default function useRefParity(className, elementRef) {
  const parity = ref(null);

  onMounted(() => {
    nextTick(() => {
      const elements = Array.from(document.getElementsByClassName(className));
      const index = elements.indexOf(elementRef.value);
      const num = index + 1;
      parity.value = ((num % 2) === 1) ? 'odd' : 'even';
    });
  });

  return {
    parity: readonly(parity)
  };
}
