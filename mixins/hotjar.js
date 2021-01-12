export default {
  computed: {
    $hotjarConfigured() {
      return this.$config.hotjar && this.$config.hotjar.id && this.$config.hotjar.sv;
    }
  },

  methods: {
    $hotjarTrackingCode(h, o, t, j, a, r) {
      h.hj = h.hj || function() {
        (h.hj.q = h.hj.q || []).push(arguments);
      };
      h['_hjSettings'] = { hjid: this.$config.hotjar.id, hjsv: this.$config.hotjar.sv };
      a = o.getElementsByTagName('head')[0];
      r = o.createElement('script'); r.async = 1;
      r.src = t + h['_hjSettings'].hjid + j + h['_hjSettings'].hjsv;
      a.appendChild(r);
    }
  },

  mounted() {
    if (this.$hotjarConfigured) {
      this.$hotjarTrackingCode(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
    }
  }
};
