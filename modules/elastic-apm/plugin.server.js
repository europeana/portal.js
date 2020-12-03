import elasticApmNode from 'elastic-apm-node';

export default ({ $config }) => {
  const config = ($config && $config.elastic ? $config.elastic.apm : undefined) || {};

  if (!config.serverUrl || elasticApmNode.isStarted()) return;

  elasticApmNode.start(config);
};
