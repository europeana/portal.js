import { escapeLuceneSpecials } from '../utils';

// Configuration for constructing similar items queries
const SIMILAR_ITEMS_FIELDS = new Map([
  ['what', { data: ['dcSubject', 'dcType'], boost: 0.8 }],
  ['who', { data: ['dcCreator'], boost: 0.5 }],
  ['DATA_PROVIDER', { data: ['edmDataProvider'], boost: 0.2 }]
]);

/**
 * Construct Record API similar items query
 * @param {string} about Europeana identifier of the current item
 * @param {Object} [data={}] Current item data
 * @return {string} Query to send to the Record API
 */
export default (about, data = {}) => {
  const queryTerms = new Map;

  // Map the terms from item data onto their respective similar items query fields
  for (const [queryField, queryFieldOptions] of SIMILAR_ITEMS_FIELDS) {
    for (const dataField of queryFieldOptions.data) {
      if (data[dataField]) {
        queryTerms.set(queryField, (queryTerms.get(queryField) || []).concat(data[dataField]));
        if (queryTerms.get(queryField).length === 0) queryTerms.delete(queryField);
      }
    }
  }

  // Construct one fielded and boosted query of potentially multiple terms
  const fieldQueries = [];
  for (const [queryField, queryFieldTerms] of queryTerms) {
    const boost = SIMILAR_ITEMS_FIELDS.get(queryField).boost;
    const fieldQuery = `${queryField}:(` + queryFieldTerms.map((term) => {
      return '"' + escapeLuceneSpecials(term) + '"';
    }).join(' OR ') + `)^${boost}`;
    fieldQueries.push(fieldQuery);
  }

  // No queries, no query
  if (fieldQueries.length === 0) return null;

  // Combine fielded queries, and exclude the current item
  const query = '(' + fieldQueries.join(' OR ') + `) NOT europeana_id:"${about}"`;
  return query;
};
