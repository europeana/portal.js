import merge from 'deepmerge';
import Swiper from 'swiper';
import 'swiper/swiper-bundle.min.css';

export default {
  data() {
    return {
      swiper: null,
      swiperDefaultOptions: {
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
          afterInit: this.swiperOnAfterInit
        },
        pagination: {
          clickable: true,
          el: '.swiper-pagination',
          type: 'bullets',
          renderBullet: (index, className) => `<button aria-label="${this.$t('swiper.paginationBulletLabel', { page: index + 1 })}" class="${className}"></button>`
        },
        slidesPerView: 'auto'
      },
      swiperOptions: {},
      swiperReady: false
    };
  },

  mounted() {
    this.swiper = new Swiper('.swiper', merge(this.swiperDefaultOptions, this.swiperOptions));
  },

  methods: {
    swiperOnAfterInit() {
      this.swiperReady = true;
    }
  }
};
