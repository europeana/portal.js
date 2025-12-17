import baseData from './index.js';
import { createEuropeanaApiClient } from '../utils.js';
import { isEntityUri } from '../../plugins/europeana/entity.js';
import uniq from 'lodash/uniq.js';
// TODO: remove and uninstall when deprecated after API released with place references for countries
import countryCodes from 'i18n-iso-countries';
import { codes as localeCodes } from '@europeana/i18n';

const PICK = ['slug', 'recordCount', 'prefLabel', 'countryPrefLabel'];
const LOCALISE = 'countryPrefLabel';

let axiosClient;
let axiosClientEntity;

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

async function getCountryPrefLabel(entityUrl) {
  const response = await axiosClientEntity.get(entityUrl);
  return response.data.prefLabel;
}

const data = async(config = {}) => {
  const organisationData = await baseData({ type: 'organization' }, config);

  axiosClient = createEuropeanaApiClient(config.europeana?.apis?.record);
  axiosClientEntity = createEuropeanaApiClient(config.europeana?.apis?.entity);

  const recordCounts = await getRecordCounts();

  // Get array with all unique countries to only have to request prefLabels once
  const organisationCountries = uniq(organisationData.map(organisation => organisation.country));

  const organisationCountriesPrefLabels = {};
  for (const country of organisationCountries) {
    // Acceptance Entity API returns entity URI for country
    if (isEntityUri(country)) {
      const entityId = country.split('/').pop();
      organisationCountriesPrefLabels[country] = await getCountryPrefLabel(`/place/${entityId}.json`);
    } else if (isEntityUri(country?.id) && country.prefLabel) {
      organisationCountriesPrefLabels[country.id] = country.prefLabel;
    } else if (country) {
      // Production Entity API returns country code. This as in between solution.
      // TODO: remove when deprecated after API released with place references for countries
      const countryPrefLabelForLocale = {};
      for (const locale of localeCodes) {
        const countryNameFromCode = countryCodes.getName(country, locale, { select: 'official' });
        if (countryNameFromCode) {
          countryPrefLabelForLocale[locale] = countryNameFromCode;
        }
      }
      organisationCountriesPrefLabels[country] = countryPrefLabelForLocale;
    }
  }

  return organisationData.map(
    organisation => {
      // Add recordCount
      const organisationId = organisation.id;
      const organisationWithCount = recordCounts.find(facet => facet.label === organisationId);
      const recordCount = organisationWithCount?.count || 0;
      organisation.recordCount = recordCount;

      // Add countryPrefLabel with langmap prefLabel
      organisation.countryPrefLabel = organisationCountriesPrefLabels[organisation.country?.id || organisation.country] || organisation.country;

      return organisation;
    });
};

export {
  data,
  LOCALISE,
  PICK
};
