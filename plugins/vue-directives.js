import Vue from 'vue';

Vue.directive('visible-on-scroll', {
  inserted: (el) => {
    el.scrolledVisible = true;
    if (process.browser) {
      window.addEventListener('scroll', () => handleScroll(el));
      window.addEventListener('orientationchange', () => handleOrientationChange(el));
    }
  }
});

const handleScroll = (el) => {
  const newPosition = window.scrollY;
<<<<<<< HEAD
  if (onDesktop && el.scrollPosition < newPosition && el.scrollPosition > 150 && el.scrolledVisible) {
    el.setAttribute('style', 'transform: translate3d(0, -100%, 0)');
=======
  if (onDesktop() && el.scrollPosition < newPosition && el.scrollPosition > 150 && el.scrolledVisible) {
    el.setAttribute('style', 'transform: translate3d(0, -150px, 0)');
>>>>>>> befc33650650284fee36fa0b334bfdce143793d8
    el.scrolledVisible = false;
  } else if (onDesktop() && ((el.scrollPosition - 5) > newPosition || el.scrollPosition <= 150) && !el.scrolledVisible) {
    el.setAttribute('style', 'transform: translate3d(0, 0, 0)');
    el.scrolledVisible = true;
  }
  el.scrollPosition = newPosition;
};

const handleOrientationChange = (el) => {
  const orientation = window.orientation;
  if (orientation === 0 || orientation === 180) {
    el.setAttribute('style', 'transform: translate3d(0, 0, 0)');
    el.scrolledVisible = true;
  }
};

const desktopWidth = 992;

const onDesktop = () => {
  return desktopWidth <= document.documentElement.clientWidth;
};
