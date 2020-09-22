import annotation from './europeana/annotation';
import entity from './europeana/entity';
import mediaProxy from './europeana/mediaProxy';
import record from './europeana/record';

export default ({ store }, inject) => {
  const config = store.state.apis;

  inject('apis', {
    config,
    annotation: annotation(config),
    entity: entity(config),
    mediaProxy: mediaProxy(config),
    record: record(config)
  });
};
