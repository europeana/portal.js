import axios from 'axios';
import EuropeanaEntityApi from '../../plugins/europeana/entity.js';
import { getLabelledSlug } from '../../plugins/europeana/utils.js';

export default (params = {}, context = {}) => {
  const api = context.$apis?.entity || new EuropeanaEntityApi(context);

  const pageSize = 100;

  const firstPageOfEntityResults = (params = {}) => api.search({
    query: '*:*',
    scope: 'europeana',
    sort: 'id',
    pageSize,
    ...params
  });

  const nextPageOfEntityResults = (url) => axios.get(url)
    .then((response) => response.data);

  const entityWithSlug = (entity) => ({
    ...entity,
    slug: getLabelledSlug(entity.id, entity.prefLabel?.en)
  });

  const allEntityResults = async(params) => {
    let allResults = [];
    let pageOfResults;
    let next;

    // the API allows 100 entities per request. Loop until all entities are retrieved.
    while (!Array.isArray(pageOfResults) || next) {
      const response = await (next ? nextPageOfEntityResults(next) : firstPageOfEntityResults(params));
      // console.log('response', response)
      pageOfResults = (response.items || []).map(entityWithSlug);
      allResults = allResults.concat(pageOfResults);
      next = response.next;
    }

    return allResults;
  };

  return allEntityResults(params);
};
