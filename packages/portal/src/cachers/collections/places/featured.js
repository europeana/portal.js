import baseData from '../index.js';

const PICK = ['id', 'prefLabel', 'isShownBy'];
const LOCALISE = 'prefLabel';
const SORT = 'prefLabel';
const DAILY = 4;

const data = (context = {}) => baseData({ type: 'place' }, context);

export {
  data,
  LOCALISE,
  PICK,
  SORT,
  DAILY
};
