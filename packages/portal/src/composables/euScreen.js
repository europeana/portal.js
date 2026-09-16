import { computed } from 'vue';

export function useEuScreen(url) {
  const isEuScreenItem = computed(() => {
    return url?.startsWith('http://www.euscreen.eu/item.html') ||
      url?.startsWith('https://www.euscreen.eu/item.html') ||
      false;
  });

  const id = computed(() => {
    return isEuScreenItem.value ? (new URL(url)).searchParams.get('id') : undefined;
  });

  const embedUrl = computed(() => {
    return id.value && `https://euscreen.embd.eu/${id.value}`;
  });

  return {
    embedUrl,
    id,
    isEuScreenItem
  };
}
