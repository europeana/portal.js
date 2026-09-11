import baseData from '../index.js';
import { organisationData, PICK, LOCALISE } from '../organisations.js';

const data = async(context = {}) => {
  const organisationsData = await baseData({ qf: 'type:Organization' }, context);
  const aggregatorsData = await baseData({ qf: 'type:Aggregator AND aggregatedVia:*' }, context);
  const entityData = organisationsData.concat(aggregatorsData);

  return entityData.map(organisationData);
};

export {
  data,
  LOCALISE,
  PICK
};
