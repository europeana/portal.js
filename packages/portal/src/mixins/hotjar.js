export default {
  data() {
    return {
      hotjarId: null,
      hotjarSv: null
    };
  },

  methods: {
    initHotjar() {
      if (!this.hotjarId || !this.hotjarSv) {
        return;
      }
      const hjid = this.hotjarId, hjsv = this.hotjarSv;

      // cutesy weirdness courtesy of hotjar
      (function(h, o, t, j, a, r) {
        h.hj = h.hj || function() {
          (h.hj.q = h.hj.q || []).push(arguments);
        };
        h['_hjSettings'] = { hjid, hjsv };
        a = o.getElementsByTagName('head')[0];
        r = o.createElement('script'); r.async = 1;
        r.src = t + h['_hjSettings'].hjid + j + h['_hjSettings'].hjsv;
        a.appendChild(r);
      })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
    }
  }
};