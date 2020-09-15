import elasticApmNode from 'elastic-apm-node';

import options from './options';

export default () => {
  if (elasticApmNode.isStarted()) return;
  elasticApmNode.start(options);
};
