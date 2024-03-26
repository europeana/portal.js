import baseData from './index.js';

const PICK = ['slug', 'prefLabel', 'recordCount'];
const LOCALISE = 'prefLabel';
const SORT = 'prefLabel';

const data = (config = {}) => baseData({ type: 'concept' }, config, { recordCounts: 'skos_concept' });

export {
  data,
  LOCALISE,
  PICK,
  SORT
};
