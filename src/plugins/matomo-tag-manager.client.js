export default ({ $config }) => {
  if (!$config.matomo || !$config.matomo.host || !$config.matomo.tagManagerContainerId) {
    return;
  }

  window.mtm = window.mtm || [];
  const mtm = window.mtm;

  mtm.push({ 'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start' });

  (function() {
    const d = document;
    const g = d.createElement('script');
    const s = d.getElementsByTagName('script')[0];
    g.type = 'text/javascript';
    g.async = true;
    g.src = `${$config.matomo.host}/js/container_${$config.matomo.tagManagerContainerId}.js`;
    s.parentNode.insertBefore(g, s);
  })();
};
