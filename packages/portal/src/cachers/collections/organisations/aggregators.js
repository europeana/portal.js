import baseData from '../index.js';
import { createEuropeanaApiClient } from '../../utils.js';

const PICK = ['id', 'slug', 'recordCount', 'prefLabel', 'geographicScope', 'countryPrefLabel', 'heritageDomain', 'logo'];
const LOCALISE = 'countryPrefLabel';

let axiosClientEntity;

async function getFullEntity(entityUrl) {
  const response = await axiosClientEntity.get(entityUrl);
  return response.data;
}

const data = async(config = {}) => {
  const organisationData = await baseData({ type: 'aggregator' }, config);

  axiosClientEntity = createEuropeanaApiClient(config.europeana?.apis?.entity);

  // TODO: is this a good idea? won't it fire dozens of API requests at the same time?
  return await Promise.all(organisationData.map(
    async(organisation) => {
      // Add heritageDomain or countryPrefLabel depending on geographicScope
      const entityId = organisation.id.split('/').pop();
      const fullEntityResponse = await getFullEntity(`/organization/${entityId}.json`);

      if (fullEntityResponse?.geographicScope === 'International') {
        organisation.heritageDomain = fullEntityResponse?.heritageDomain;
      } else {
        organisation.countryPrefLabel = organisation.country.prefLabel;
      }

      organisation.geographicScope = fullEntityResponse?.geographicScope;
      organisation.recordCount = organisation.isAggregatedBy.recordCount;

      return organisation;
    }));
};

export {
  data,
  LOCALISE,
  PICK
};
