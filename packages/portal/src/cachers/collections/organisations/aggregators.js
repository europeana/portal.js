import baseData from '../index.js';
import { organisationData } from '../organisations.js';
import EuropeanaEntityApi from '../../../plugins/europeana/entity.js';

const PICK = ['id', 'slug', 'recordCount', 'prefLabel', 'altLabel', 'geographicScope', 'countryPrefLabel', 'heritageDomain', 'logo'];
const LOCALISE = 'countryPrefLabel';

const data = async(context = {}) => {
  const api = context.$apis?.entity || new EuropeanaEntityApi(context);

  const entityData = await baseData({ type: 'aggregator' }, context);
  const entityIds = entityData.map((entity) => entity.id);

  const fullEntities = await api.retrieve(entityIds, { profile: 'dereference' });

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
