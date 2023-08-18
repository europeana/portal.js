import { countEntities } from '../index.js';

const LOCALISE = false;
const PICK = false;

const data = (config = {}) => countEntities({ type: 'organization' }, config);

export {
  data,
  LOCALISE,
  PICK
};
