import { escapeLuceneSpecials } from '../utils';

// Configuration for constructing similar items queries
const SIMILAR_ITEMS_FIELDS = {
  what: { data: ['dcSubject', 'dcType'], boost: 0.8 },
  who: { data: ['dcCreator'], boost: 0.5 },
  'DATA_PROVIDER': { data: ['edmDataProvider'], boost: 0.2 }
};

// Construct one fielded and boosted query of potentially multiple terms
const fieldQueriesFromQueryTerms = (queryTerms) => {
  return Object.keys(queryTerms).map(queryField => {
    const boost = SIMILAR_ITEMS_FIELDS[queryField].boost;

    return `${queryField}:(` + queryTerms[queryField].map((term) => {
      return '"' + escapeLuceneSpecials(term) + '"';
    }).join(' OR ') + `)^${boost}`;
  });
};

// Maps the terms from item data onto their respective similar items query fields
const queryTermsFromItemData = (item) => {
  return Object.keys(SIMILAR_ITEMS_FIELDS).reduce((memo, queryField) => {
    for (const dataField of SIMILAR_ITEMS_FIELDS[queryField].data) {
      if (item[dataField]) {
        memo[queryField] = (memo[queryField] || []).concat(item[dataField]);
        if (memo[queryField].length === 0) delete memo[queryField];
      }
    }

    return memo;
  }, {});
};

/**
 * Construct Record API similar items query
 * @param {string} about Europeana identifier of the current item
 * @param {Object} [item={}] Current item data
 * @return {string} Query to send to the Record API
 */
const similarItemsQuery = (about, item = {}) => {
  const queryTerms = queryTermsFromItemData(item);

  const fieldQueries = fieldQueriesFromQueryTerms(queryTerms);

  let query = null;
  // No queries, no query
  if (fieldQueries.length > 0) {
    // Combine fielded queries, and exclude the current item
    query = '(' + fieldQueries.join(' OR ') + `) NOT europeana_id:"${about}"`;
  }

  return query;
};

export default similarItemsQuery;
