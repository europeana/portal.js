export default ({ $config }, inject) => {
  if (!$config.hotjar?.id || !$config.hotjar?.sv) {
    return;
  } else {
    inject('initHotjar', init);
  }

  function init() {
    (function(h, o, t, j, a, r) {
      h.hj = h.hj || function() {
        (h.hj.q = h.hj.q || []).push(arguments);
      };
      h['_hjSettings'] = { hjid: $config.hotjar.id, hjsv: $config.hotjar.sv };
      a = o.getElementsByTagName('head')[0];
      r = o.createElement('script'); r.async = 1;
      r.setAttribute('src', t + h['_hjSettings'].hjid + j + h['_hjSettings'].hjsv);
      a.appendChild(r);
    })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
  }
};
