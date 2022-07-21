import baseData from '../index.js';

const PICK = ['id', 'prefLabel', 'logo'];
const DAILY = 4;

const data = (config = {}) => baseData({ type: 'organization' }, config);

export {
  data,
  PICK,
  DAILY
};
