function scrollToSelector(selector, options = {}) {
  scrollToElement(document.querySelector(selector, options));
}

function scrollToElement(element, options = {}) {
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
}

function scrollElementToCentre(element, options = {}) {
  const { container } = { container: window, ...options };

  if (!element || !container) {
    return;
  }

  const offsetLeft = -((container.offsetWidth - element.offsetWidth) / 2);
  const offsetTop = -((container.offsetHeight - element.offsetHeight) / 2);

  scrollToElement(element, { ...options, offsetLeft, offsetTop });
}

export default function useScrollTo() {
  return {
    scrollElementToCentre,
    scrollToElement,
    scrollToSelector
  };
}
