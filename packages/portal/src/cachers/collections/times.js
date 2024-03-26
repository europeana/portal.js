import baseData from './index.js';

const PICK = ['slug', 'prefLabel', 'recordCount'];
const LOCALISE = 'prefLabel';
const SORT = 'prefLabel';

const data = (config = {}) => baseData({ type: 'timespan' }, config, { recordCounts: 'edm_timespan' });

export {
  data,
  LOCALISE,
  PICK,
  SORT
};
