export default {
  inserted: (el, binding, vnode) => {
    const routeHWithHash = vnode.context.$route.hash;
    el.scrolledVisible = !routeHWithHash;
    el.setAttribute('style', 'transform: translate3d(0, 0, 0)');
    if (process.browser) {
      window.addEventListener('scroll', () => handleScroll(el));
      // TODO: update to observe ScreenOrientation update instead: screen.orientation.addEventListener("change", (event) => {
      window.addEventListener('orientationchange', () => handleOrientationChange(el));
      window.addEventListener('hashchange', () => el.scrolledVisible = false);
    }
  }
};

const handleScroll = (el) => {
  const oldPosition = el.scrollPosition ?? 0;
  const newPosition = window.scrollY;

  // TODO: When scrolling a lot at once, it's possible to skip the 150px threshold on the first scroll event.
  // Should we check that the new position is > 150 instead to prevent this?
  if (onDesktop() && oldPosition < newPosition && oldPosition > 150 && el.scrolledVisible) {
    el.setAttribute('style', 'transform: translate3d(0, -100%, 0)');
    el.scrolledVisible = false;
    el.classList.remove('show');
  } else if (onDesktop() && ((oldPosition - 5) > newPosition || oldPosition <= 150) && !el.scrolledVisible) {
    el.setAttribute('style', 'transform: translate3d(0, 0, 0)');
    el.classList.add('show');
    el.scrolledVisible = true;
  }
  el.scrollPosition = newPosition;
};

const handleOrientationChange = (el) => {
  const orientation = window.orientation;
  if (orientation === 0 || orientation === 180) { // TODO: Aside from being deprecated, what is this checking?
    el.setAttribute('style', 'transform: translate3d(0, 0, 0)');
    el.scrolledVisible = true;
  }
};

const desktopWidth = 992; // Needs to match $bp-large

const onDesktop = () => {
  return desktopWidth <= document.documentElement.clientWidth;
};
