import { escapeLuceneSpecials } from '../utils';

// Configuration for constructing similar items queries
const SIMILAR_ITEMS_FIELDS = new Map([
  ['what', { data: ['dcSubject', 'dcType'], boost: 0.8 }],
  ['who', { data: ['dcCreator'], boost: 0.5 }],
  ['DATA_PROVIDER', { data: ['edmDataProvider'], boost: 0.2 }]
]);

// Construct one fielded and boosted query of potentially multiple terms
const fieldQueriesFromQueryTerms = (queryTerms) => {
  const fieldQueries = [];

  for (const [queryField, queryFieldTerms] of queryTerms) {
    const boost = SIMILAR_ITEMS_FIELDS.get(queryField).boost;
    const fieldQuery = `${queryField}:(` + queryFieldTerms.map((term) => {
      return '"' + escapeLuceneSpecials(term) + '"';
    }).join(' OR ') + `)^${boost}`;
    fieldQueries.push(fieldQuery);
  }

  return fieldQueries;
};

// Maps the terms from item data onto their respective similar items query fields
const queryTermsFromItemData = (item) => {
  const queryTerms = new Map;

  for (const [queryField, queryFieldOptions] of SIMILAR_ITEMS_FIELDS) {
    for (const dataField of queryFieldOptions.data) {
      if (item[dataField]) {
        queryTerms.set(queryField, (queryTerms.get(queryField) || []).concat(item[dataField]));
        if (queryTerms.get(queryField).length === 0) queryTerms.delete(queryField);
      }
    }
  }

  return queryTerms;
};

/**
 * Construct Record API similar items query
 * @param {string} about Europeana identifier of the current item
 * @param {Object} [item={}] Current item data
 * @return {string} Query to send to the Record API
 */
export default (about, item = {}) => {
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
