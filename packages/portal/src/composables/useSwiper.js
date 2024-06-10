import { ref, onMounted } from 'vue';
import merge from 'deepmerge';
import Swiper from 'swiper';
import 'swiper/swiper-bundle.min.css';

// TODO: refactor provision of Vue I18n's $t with importing useI18n
export default ($t, options = {}) => {
  const ready = ref(false);
  const swiper = ref(null);

  const afterInit = () => {
    ready = true;
  };

  const defaults = {
    keyboard: {
      enabled: true,
      pageUpDown: false
    },
    lazy: {
      enabled: true,
      checkInView: true,
      loadPrevNext: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    on: {
      afterInit
    },
    pagination: {
      clickable: true,
      el: '.swiper-pagination',
      type: 'bullets',
      renderBullet: (index, className) => `<button aria-label="${$t('swiper.paginationBulletLabel', { page: index + 1 })}" class="${className}"></button>`
    },
    slidesPerView: 'auto'
  };

  onMounted(() => {
    console.log('useSwiper onMounted')
    swiper.value = new Swiper('.swiper', merge(defaults, options))
  });

  return {
    swiper,
    ready
  };
};
