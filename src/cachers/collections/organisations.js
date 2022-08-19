import baseData from './index.js';
import organizationsMixin from '../../mixins/europeana/entities/organizations.js';
import { langMapValueForLocale } from '../../plugins/europeana/utils.js';
import { createEuropeanaApiClient } from '../utils.js';

const PICK = ['slug', 'recordCount', 'nativeLabel', 'nonNativeEnglishLabel'];
const INTERNATIONALISE = (entities) => entities.map((entity) => ({
  ...entity,
  nativeLabel: langMapValueForLocale(organizationsMixin.methods.organizationEntityNativeName(entity)),
  nonNativeEnglishLabel: langMapValueForLocale(organizationsMixin.methods.organizationEntityNonNativeEnglishName(entity))
}));

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
  const baseOrgData = await baseData({ type: 'organization' }, config);

  axiosClient = createEuropeanaApiClient(config.europeana?.apis?.record);

  const recordCounts = await getRecordCounts();

  Object.keys(baseOrgData).forEach(
    key => {
      const organisationId = baseOrgData[key].id;
      const organisation = recordCounts.filter(facet => facet.label === organisationId)[0];
      const recordCount = organisation?.count;
      return baseOrgData[key].recordCount = recordCount;
    });

  return baseOrgData;
};

export {
  data,
  INTERNATIONALISE,
  PICK
};
