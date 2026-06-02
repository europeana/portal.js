import baseData from './index.js';

const PICK = ['id', 'slug', 'prefLabel'];
const LOCALISE = 'prefLabel';
const SORT = 'prefLabel';

const data = (context = {}) => baseData({ type: 'concept' }, context);

export {
  data,
  LOCALISE,
  PICK,
  SORT
};
