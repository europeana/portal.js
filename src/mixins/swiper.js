export default {
  data() {
    return {
      swiper: null
    };
  },

  mounted() {
    if (window.Swiper) {
      this.swiper = new window.Swiper('.swiper', this.swiperOptions);
    }
  },

  methods: {
    onAfterInit() {
      this.ready = true;
    }
  }
};
