import baseData from './index.js';

const PICK = ['slug', 'prefLabel'];
const LOCALISE = 'prefLabel';

const data = (config = {}) => baseData({ type: 'organization' }, config);

export {
  data,
  LOCALISE,
  PICK
};
