// Can be used for full width element parallax effect
// add and remove scroll event listener on mounted/beforeDestroy and use this function as callback
export default (elementSelector) => {
  const element = document.querySelector(elementSelector);
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
