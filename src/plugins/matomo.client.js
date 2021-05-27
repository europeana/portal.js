export default ({ $config }) => {
  if (!$config.matomo || !$config.matomo.url || !$config.matomo.idsite) {
    return;
  }

  window.paq = window.paq || [];
  const paq = window.paq;

  paq.push(['trackPageView']);
  paq.push(['enableLinkTracking']);

  (function() {
    const u = $config.matomo.url;
    paq.push(['setTrackerUrl', `${u}/matomo.php`]);
    paq.push(['setSiteId', $config.matomo.idsite]);
    const d = document;
    const g = d.createElement('script');
    const s = d.getElementsByTagName('script')[0];
    g.type = 'text/javascript';
    g.async = true;
    g.src = `${u}/matomo.js`;
    s.parentNode.insertBefore(g, s);
  })();
};
