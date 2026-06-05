import baseData from '../index.js';
import { organisationData, PICK, LOCALISE } from '../organisations.js';

const data = async(context = {}) => {
  const entityData = await baseData({ qf: 'type:Organization' }, context);

  return entityData.map(organisationData);
};

export {
  data,
  LOCALISE,
  PICK
};
