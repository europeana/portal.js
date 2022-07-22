import baseData from './index.js';

const PICK = ['slug', 'prefLabel'];

const data = (config = {}) => baseData({ type: 'organization' }, config);

export {
  data,
  PICK
};
