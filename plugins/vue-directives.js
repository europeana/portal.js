import Vue from 'vue';
Vue.directive('scroll',
  (el, binding) => {
    let handleStickyNav = (evt) => {
      if (binding.value(evt, el)) {
        window.removeEventListener('scroll', handleStickyNav);
      }
    };
    window.addEventListener('scroll', handleStickyNav);
  });
