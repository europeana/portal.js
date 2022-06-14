import Swiper from 'swiper';
import 'swiper/swiper-bundle.min.css';

export default {
  data() {
    return {
      swiper: null
    };
  },

  mounted() {
    this.swiper = new Swiper('.swiper', this.swiperOptions);
  },

  methods: {
    swiperOnAfterInit() {
      this.swiperReady = true;
    }
  }
};
