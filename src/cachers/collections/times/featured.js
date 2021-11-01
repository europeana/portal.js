import baseData from '../index.js';

const PICK = ['id', 'prefLabel', 'isShownBy'];
const LOCALISE = 'prefLabel';
const DAILY = 4;

const data = (config = {}) => baseData({ type: 'timespan' }, config);

export {
  data,
  LOCALISE,
  PICK,
  DAILY
};
