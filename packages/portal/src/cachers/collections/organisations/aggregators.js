import baseData from '../index.js';
import { organisationData } from '../organisations.js';
import { createEuropeanaApiClient } from '../../utils.js';

const PICK = ['id', 'slug', 'recordCount', 'prefLabel', 'altLabel', 'geographicScope', 'countryPrefLabel', 'heritageDomain', 'logo', 'aggregatesFrom'];
const LOCALISE = 'countryPrefLabel';

let axiosClientEntity;

const data = async(config = {}) => {
  axiosClientEntity = createEuropeanaApiClient(config.europeana?.apis?.entity);

  const entityData = await baseData({ type: 'aggregator' }, config);
  const entityIds = entityData.map((entity) => entity.id);

  const retrieveResponse = await axiosClientEntity.post('/retrieve', entityIds, { params: { profile: 'dereference' } });
  const fullEntities = retrieveResponse.data.items;

  return entityData
    .map((entity) => {
      return {
        ...entity, // keep the slug from baseData
        ...fullEntities.find((fullEntity) => fullEntity.id === entity.id)
      };
    })
    .filter(Boolean)
    .map(organisationData);
};

export {
  data,
  LOCALISE,
  PICK
};
