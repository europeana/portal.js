import baseData from './index.js';

const PICK = ['slug', 'prefLabel'];
const LOCALISE = 'prefLabel';

const data = (config = {}) => baseData({ type: 'timespan' }, config);

export {
  data,
  LOCALISE,
  PICK
};
