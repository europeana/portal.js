import baseData from '../index.js';

const PICK = ['id', 'prefLabel', 'logo'];
const LOCALISE = 'prefLabel';
const DAILY = 4;

const data = (config = {}) => baseData({ type: 'organization' }, config);

export {
  data,
  LOCALISE,
  PICK,
  DAILY
};
