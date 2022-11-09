import baseData from './index.js';
import { createEuropeanaApiClient } from '../utils.js';

const PICK = ['slug', 'recordCount', 'prefLabel'];

let axiosClient;

async function getRecordCounts() {
  const params = {
    profile: 'facets',
    query: 'foaf_organization:*data.europeana.eu*',
    facet: 'foaf_organization',
    ['f.foaf_organization.facet.limit']: 10000,
    rows: 0
  };
  const response = await axiosClient.get('/search.json', { params });
  return response.data?.facets?.[0]?.fields || [];
}

const data = async(config = {}) => {
  const organisationData = await baseData({ type: 'organization' }, config);

  axiosClient = createEuropeanaApiClient(config.europeana?.apis?.record);

  const recordCounts = await getRecordCounts();

  return organisationData.map(
    organisation => {
      const organisationId = organisation.id;
      const organisationWithCount = recordCounts.find(facet => facet.label === organisationId);
      const recordCount = organisationWithCount?.count || 0;
      organisation.recordCount = recordCount;
      return organisation;
    });
};

export {
  data,
  PICK
};
