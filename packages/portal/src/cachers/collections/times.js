import baseData from './index.js';

const PICK = ['id', 'slug', 'prefLabel'];
const LOCALISE = 'prefLabel';
const SORT = 'prefLabel';

const data = (context = {}) => baseData({ type: 'timespan' }, context);

export {
  data,
  LOCALISE,
  PICK,
  SORT
};
