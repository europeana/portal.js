import recordPlugin, { reduceEntity, reduceWebResource } from '../../../plugins/europeana/record.js';

const ENTITY_KEYS = ['agents', 'concepts', 'organizations', 'places', 'timespans'];

const reduceVerbosity = (responseData) => {
  for (const entityKey of ENTITY_KEYS) {
    if (responseData.object[entityKey]) {
      responseData.object[entityKey] = responseData.object[entityKey].map(entity => reduceEntity(entity));
    }
  }

  for (const aggregation of responseData.object.aggregations) {
    if (aggregation.webResources) {
      aggregation.webResources = aggregation.webResources.map(webResource => reduceWebResource(webResource));
    }
  }

  return responseData;
};

export default (config = {}) => (req, res) => {
  const europeanaId = `/${req.params.datasetId}/${req.params.localId}`;
  return recordPlugin({ $config: config })
    .get(europeanaId)
    .then(response => reduceVerbosity(response.data))
    .then(responseData => res.json(responseData));
  // return res.json(req.params);
  // return cached(id, config, { parse: false })
  //   .then(data => {
  //     res.set('Content-Type', 'application/json');
  //     res.send(data);
  //   })
  //   .catch(error => errorHandler(res, error));
};
