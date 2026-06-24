export default {
  inserted: (el, binding, vnode) => {
    element = el;
    routeWithHash = vnode.context.$route.hash;

    if (process.browser && onDesktop()) {
      enableVisibleOnScroll();
    }

    window.addEventListener('resize', handleResize);
  }

  // TODO remove even listeners on unmounted? Current use in header, is always mounted
};

let element;
let routeWithHash;

let enabled = false;
const desktopWidth = 992; // Must match $bp-large

const onDesktop = () => window.innerWidth >= desktopWidth;

const handleScroll = () => {
  const oldPosition = element.scrollPosition ?? 0;
  const newPosition = window.scrollY;
  const scrolledDown = oldPosition < newPosition;
  const scrolledUp = oldPosition - 5 > newPosition;

  if (scrolledDown && oldPosition > 150 && element.scrolledVisible) {
    element.style.transform = 'translate3d(0, -100%, 0)';
    element.classList.remove('show');
    element.scrolledVisible = false;
  } else if ((scrolledUp || oldPosition <= 150) && !element.scrolledVisible) {
    element.style.transform = 'translate3d(0, 0, 0)';
    element.classList.add('show');
    element.scrolledVisible = true;
  }
  element.scrollPosition = newPosition;
};

const handleHashChange = () => {
  element.scrolledVisible = false;
};

const enableVisibleOnScroll = () => {
  element.scrolledVisible = !routeWithHash;
  element.style.transform = 'translate3d(0, 0, 0)';
  element.classList.add('show');

  window.addEventListener('scroll', handleScroll);
  window.addEventListener('hashchange', handleHashChange);
  enabled = true;
};

const disableVisibleOnScroll = () => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('hashchange', handleHashChange);
  element.style.transform = 'translate3d(0, 0, 0)';
  element.classList.remove('show');
  enabled = false;
};

const handleResize = () => {
  if (!enabled && onDesktop()) {
    enableVisibleOnScroll();
  } else if (enabled && !onDesktop()) {
    disableVisibleOnScroll();
  }
};
