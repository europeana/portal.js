import baseData from '../index.js';

const PICK = ['id', 'prefLabel', 'isShownBy'];
const LOCALISE = 'prefLabel';
const SORT = 'prefLabel';
const DAILY = 4;
const FEATURED = [
  '106',
  '112',
  '113',
  '1146',
  '120',
  '124',
  '14',
  '1409',
  '15',
  '1594',
  '1600',
  '1603',
  '1618',
  '1645',
  '1647',
  '1653',
  '1654',
  '1659',
  '1664',
  '1665',
  '1668',
  '167',
  '1672',
  '1673',
  '1700',
  '1705',
  '1710',
  '1719',
  '1720',
  '187',
  '19',
  '194',
  '23',
  '235',
  '236',
  '237',
  '238',
  '24',
  '247',
  '258',
  '277',
  '29',
  '30',
  '31',
  '321',
  '33',
  '35',
  '37',
  '41',
  '43',
  '46',
  '47',
  '49',
  '50',
  '51',
  '52',
  '54',
  '56',
  '59',
  '6',
  '60',
  '61',
  '74',
  '744',
  '79',
  '84',
  '86'
];

const featuredQf = FEATURED
  .map((idNum) => `*/${idNum}`)
  .join(' OR ');

const data = (config = {}) => baseData({ type: 'concept', qf: `id:(${featuredQf})` }, config);

export {
  data,
  LOCALISE,
  PICK,
  DAILY,
  SORT
};
