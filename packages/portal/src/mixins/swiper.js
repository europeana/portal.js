import merge from 'deepmerge';
import Swiper from 'swiper';
import 'swiper/swiper-bundle.min.css';

export default {
  data() {
    return {
      swiper: null,
      swiperDefaultOptions: {
        a11y: { enabled: true,
          firstSlideMessage: this.$t('swiper.a11y.firstSlide'),
          lastSlideMessage: this.$t('swiper.a11y.lastSlide'),
          nextSlideMessage: this.$t('swiper.a11y.nextSlide'),
          paginationBulletMessage: this.$t('swiper.a11y.paginationBullet', { page: '{{index}}' }),
          prevSlideMessage: this.$t('swiper.a11y.previousSlide'),
          slideLabelMessage: this.$t('swiper.a11y.slideLabel', { slide: '{{index}}', totalSlides: '{{slidesLength}}' }) },
        keyboard: {
          enabled: true,
          pageUpDown: false
        },
        lazy: true,
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
          type: 'bullets'
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
