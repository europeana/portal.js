/**
 * @file Helpers for finding europeana IDs for items matching specific criteria.
 */

function europeanaId(criteria) {
  if (criteria) {
    // TODO:
    // Search the API and select the first result?
    return '/123/abc';
  } else {
    return '/09102/_GNM_693983';
  }
}

module.exports = {
  europeanaId
};
