import { ref } from 'vue';

export default function useScrollTo() {
  const scrolling = ref(false);
  const queue = ref([]);

  const finishScrolling = () => {
    scrolling.value = false;
    if (queue.value.length > 0) {
      const { element, options } = queue.value.shift();
      scrollToElement(element, options);
    }
  };

  const enqueue = (element, options = {}) => {
    let toEnqueue = true;

    // don't enqueue if element is already next in the queue to scroll to
    if (queue.value.length > 0) {
      toEnqueue = (element !== queue.value[0].element);
    }

    if (toEnqueue) {
      queue.value.push({ element, options });
    }
  };

  const scrollToSelector = (selector, options = {}) => {
    scrollToElement(document.querySelector(selector, options));
  };

  const scrollToElement = (element, options = {}) => {
    if (scrolling.value) {
      enqueue(element, options);
      return;
    }
    scrolling.value = true;

    const { container, offsetLeft, offsetTop } = {
      container: window,
      offsetLeft: 0,
      offsetTop: 0,
      ...options
    };

    if (!element || !container) {
      return;
    }

    const left = element.offsetLeft + offsetLeft;
    const top = element.offsetTop + offsetTop;

    container.scroll({ behavior: 'smooth', left, top });

    // debounce, e.g. if triggered by window resize event
    setTimeout(finishScrolling, 300);
  };

  const scrollElementToCentre = (element, options = {}) => {
    const { container } = { container: window, ...options };

    if (!element || !container) {
      return;
    }

    const offsetLeft = -((container.offsetWidth - element.offsetWidth) / 2);
    const offsetTop = -((container.offsetHeight - element.offsetHeight) / 2);

    scrollToElement(element, { ...options, offsetLeft, offsetTop });
  };

  return {
    queue,
    scrolling,
    scrollElementToCentre,
    scrollToElement,
    scrollToSelector
  };
}
