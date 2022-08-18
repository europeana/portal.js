import baseData from '../index.js';
import { INTERNATIONALISE, SORT } from '../organisations.js';

const PICK = ['id', 'prefLabel', 'logo'];
const DAILY = 4;

const data = (config = {}) => baseData({ type: 'organization' }, config);

export {
  data,
  PICK,
  DAILY,
  INTERNATIONALISE,
  SORT
};
