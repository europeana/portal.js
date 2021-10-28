import baseData from './index.js';

const PICK = ['slug', 'prefLabel'];
// TODO: For organisations, only get English labels (for now).
const LOCALISE = 'prefLabel';

const data = (config = {}) => baseData({ type: 'organization' }, config);

export {
  data,
  LOCALISE,
  PICK
};
