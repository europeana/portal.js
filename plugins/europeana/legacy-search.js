/**
 * @file Mapping for search URLs to classic.europeana.eu portal URLs
 */

import { collectionToThemeMap } from '../../middleware/legacy/rules/search';

function mapCollections(collection) {
  return Object.keys(collectionToThemeMap).find(key => collectionToThemeMap[key] === collection) || collection;
}

const collectionQfRegex = /^collection:/;
const classicBaseUrl = 'https://classic.europeana.eu/portal/';
const qfKeyRegex = /^(.*?):/;
const qfValueRegex = /^.*?:"?(.*?)"?$/;

/**
 * Check for the presence of a collection filter.
 * @param {string[]} qfs qf values from the portal.js URL
 * @return {string} either '/search' or the collection slug
 */
function getBasePath(qfs) {
  let collectionQf = qfs.find(val => {
    return val.match(collectionQfRegex);
  });
  if (collectionQf) {
    return '/collections/' + mapCollections(collectionQf.replace(collectionQfRegex, ''));
  }
  return '/search';
}

/**
 * Map the qf values to legacy filters.
 * @param {string[]} qfs qf values from the portal.js URL
 * @return {string} Legacy URL params.
 */
function classicParamsFromQfs(qfs) {
  let returnString  = '';
  qfs.filter(qf => {
    return qfKeyRegex.test(qf) && qfValueRegex.test(qf) && !collectionQfRegex.test(qf);
  }).forEach(qf => {
    let key = qf.match(qfKeyRegex)[1];
    let value; // Value lookup depends on what the key is.
    if (key === 'proxy_dcterms_issued') {
      value = qf.match(qfValueRegex)[1];
      returnString += dateParamsFromRange(key, value);
    } else {
      value = qf.match(qfValueRegex)[1];
      returnString += `&f[${key}][]=${encodeURIComponent(value)}`;
    }
  });
  return returnString;
}

function dateParamsFromRange(key, range) {
  let rangeParts = range.replace(/\[?\]?/g, '').split(' TO ');
  return `&range[${key}][begin]=${rangeParts[0]}&range[${key}][end]=${rangeParts[1] ? rangeParts[1] : rangeParts[0]}`;
}

/**
 * Craft a classic.europeana.eu URL from relevant URL params.
 * Always retruns a string starting with https://classic.europeana.eu/portal/search/...
 * @param {string[]} params.qf qf params as present in the URL.
 * @param {string} params.reusability reusibility param as present in the URL.
 * @param {string[]} params.query query param as present in the URL.
 * @param {string[]} params.api api param as present in the URL.
 * @param {string} locale query param as present in the URL.
 * @return {string} qf adjusted with the desired content tier filter
 */
export function legacyUrl(params, locale) {
  let qfs = params.qf ? [].concat(params.qf) : [];
  let path = classicBaseUrl + locale + getBasePath(qfs);

  // classic params will always include the query
  let classicParams = '?q=' + (params.query ? params.query : '');

  classicParams += classicParamsFromQfs(qfs);
  if (params.reusability) classicParams += `&f[REUSABILITY][]=${params.reusability}`;
  if (params.api) classicParams += `&f[api][]=${params.api === 'fulltext' ? 'collection' : 'default'}`;

  return path + classicParams + `&view=${params.view ? params.view : 'grid'}`;
}

export default legacyUrl;
