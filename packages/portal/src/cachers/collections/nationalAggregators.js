import baseData from './index.js';
import { createEuropeanaApiClient } from '../utils.js';

const PICK = ['id', 'slug', 'recordCount', 'prefLabel', 'countryPrefLabel', 'logo'];
const LOCALISE = 'countryPrefLabel';

let axiosClientEntity;

async function getFullEntity(entityUrl) {
  const response = await axiosClientEntity.get(entityUrl);
  return response.data;
}

const data = async(config = {}) => {
  const organisationData = await baseData({ type: 'aggregator' }, config);

  axiosClientEntity = createEuropeanaApiClient(config.europeana?.apis?.entity);

  const nationalAggregators = await Promise.all(organisationData.map(
    async(organisation) => {
      // Add geographicScope and heritageDomain
      const entityId = organisation.id.split('/').pop();
      const fullEntityResponse = await getFullEntity(`/organization/${entityId}.json`);

      if (fullEntityResponse?.geographicScope === 'International') {
        return null;
      }

      organisation.recordCount = organisation.isAggregatedBy.recordCount;
      organisation.countryPrefLabel = organisation.country.prefLabel;

      return organisation;
    }));

  return nationalAggregators.filter(Boolean);
};

export {
  data,
  LOCALISE,
  PICK
};
