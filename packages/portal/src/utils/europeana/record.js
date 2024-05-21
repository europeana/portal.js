/**
 * Tests whether a string is a valid Europeana record ID.
 * @param {string} value Value to test
 * @return {Boolean}
 */
export function isEuropeanaRecordId(value) {
  return /^\/\d+\/\w+$/.test(value);
}

/**
 * Extracts a Record Id from a URL
 * Supported formats:
 *  ID: /90402/SK_A_2344
 *  URI: http://data.europeana.eu/item/90402/SK_A_2344
 *  Website URL: http(s)://www.europeana.eu/($LOCALE/)item/90402/SK_A_2344
 * @param {string} value URL
 * @return {string}
 */
export function recordIdFromUrl(value) {
  const urlMatch = /(\/\d+\/\w+)($|\?)/.exec(value);
  return urlMatch?.[1];
}
