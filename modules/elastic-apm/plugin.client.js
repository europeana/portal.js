import { init as initApm } from '@elastic/apm-rum';

export default ({ $config }) => {
  const config = ($config && $config.elastic ? $config.elastic.apm : undefined) || {};

  if (!config.serverUrl) return;

  initApm(config);
};
