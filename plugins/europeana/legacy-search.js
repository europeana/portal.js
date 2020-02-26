/**
 * @file Mapping for search URLs to classic.europeana.eu portal URLs
 */


function mapCollections(collection) {
  const map = {
    'ww1': 'world-war-I',
    'industrial': 'industrial-heritage',
    'manuscript': 'manuscripts',
    'map': 'maps',
    'nature': 'natural-history',
    'newspaper': 'newspapers'
  };
  return map[collection] || collection;
}

const collectionQfRegex = /^collection%3A/;
const classicBaseUrl = 'https://classic.europeana.eu/portal/';



/**
 * Craft a classic.europeana.eu URL from relevant URL params.
 * Always retruns a string starting with https://classic.europeana.eu/portal/search/...
 * @param {(string[])} params.qf qf params as present in the URL.
 * @param {(string)} params.reusability reusibility param as present in the URL.
 * @param {(string[])} params.query query param as present in the URL.
 * @return {string} qf adjusted with the desired content tier filter
 */
export function legacyUrl(params) {
  let path;
  let qfs = params['qf'] ? [].concat(params['qf']) : [];
  let collectionQf = qfs.find(val => {
    return val.match(collectionQfRegex);
  });
  if (collectionQf) {
    path = 'collections/' + mapCollections(collectionQf.replace(collectionQfRegex, ''));
  } else {
    path = 'search';
  }

  let classicParams = '?q=' + params['query'];
  qfs.filter(qf => {
    return !qf.match(collectionQfRegex);
  }).forEach(qf => {
    let key = qf.match(/^(.*)%3A/)[1];
    let value = qf.match(/^.*%3A(.*)$/)[1];
    classicParams += `&f[${key}][]=${value}`;
  });
  if (params.reusability) classicParams += `&f[REUSABILITY][]=${params.reusability}`;
  return classicBaseUrl + path + classicParams;
}

export default legacyUrl;
