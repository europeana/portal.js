import Vue from 'vue';

Vue.directive('visible-on-scroll', {
  inserted: (el) => {
    el.scrolledVisible = true;
    window.addEventListener('scroll', () => handleScroll(el));
    window.addEventListener('orientationchange', () => handleOrientationChange(el));
  }
});

const handleScroll = (el) => {
  console.log('scroll');
  let newPosition = window.scrollY;
  if (onDesktop && el.scrollPosition < newPosition && el.scrollPosition > 150 && el.scrolledVisible) {
    console.log('Down');
    el.setAttribute('style', 'transform: translate3d(0, -150px, 0)');
    el.scrolledVisible = false;
  } else if (onDesktop && el.scrollPosition > newPosition && !el.scrolledVisible) {
    console.log('UP');
    el.setAttribute('style', 'transform: translate3d(0, 0, 0)');
    el.scrolledVisible = true;
  }
  el.scrollPosition = newPosition;
};

const handleOrientationChange = (el) => {
  console.log('orientation');
  const orientation = window.orientation;
  if (orientation === 0 || orientation === 180) {
    console.log('wide');
    el.setAttribute('style', 'transform: translate3d(0, 0, 0)');
    el.scrolledVisible = true;
  }
};

const onDesktop = () => {
  const desktopWidth =  992;
  return desktopWidth <= document.documentElement.clientWidth;
};
