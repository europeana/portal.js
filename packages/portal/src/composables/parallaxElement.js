import { ref, onMounted, onUnmounted } from 'vue';

// Can be used for full width element parallax effect
// add and remove scroll event listener on mounted/beforeDestroy and use this function as callback
export const useParallaxElement = (elementSelector) => {
  const selector = ref(elementSelector);

  const parallaxElement = () => {
    const element = document.querySelector(selector.value);
    const elementHeight = element?.clientHeight || 1;
    const distanceElementToViewportTop = element?.getBoundingClientRect().top;

    if (element && distanceElementToViewportTop < 0) {
      const translate = (-distanceElementToViewportTop / elementHeight) * 75;
      element.style.transform = `translateY(${translate}%)`;
    }

    if (element && distanceElementToViewportTop > 0) {
      element.style.transform = '';
    }
  };

  // For when selector becomes available after setup
  const setSelector = (elementSelector) => {
    selector.value = elementSelector;
  };

  onMounted(() => window.addEventListener('scroll', parallaxElement));

  onUnmounted(() => window.removeEventListener('scroll', parallaxElement));

  return { setSelector };
};
