import baseData from './index.js';
import { createEuropeanaApiClient } from '../utils.js';
import { isEntityUri } from '../../plugins/europeana/entity.js';
import uniq from 'lodash/uniq.js';
// TODO: remove and uninstall when deprecated after API released with place references for countries
import countryCodes from 'i18n-iso-countries';
import localeCodes from '../../plugins/i18n/codes.js';

const LOCALISE = 'countryPrefLabel';
const PICK = ['slug', 'recordCount', 'prefLabel', 'countryPrefLabel'];

let entityApiClient;

async function getCountryPrefLabel(entityUrl) {
  const response = await entityApiClient.get(entityUrl);
  return response.data.prefLabel;
}

const data = async(config = {}) => {
  const organisationData = await baseData({ type: 'organization' }, config, { recordCounts: 'foaf_organization' });

  entityApiClient = createEuropeanaApiClient(config.europeana?.apis?.entity);

  // Get array with all unique countries to only have to request prefLabels once
  const organisationCountries = uniq(organisationData.map(organisation => organisation.country));

  const organisationCountriesPrefLabels = {};
  for (const country of organisationCountries) {
    // Acceptance Entity API returns entity URI for country
    if (isEntityUri(country)) {
      const entityId = country.split('/').pop();
      organisationCountriesPrefLabels[country] = await getCountryPrefLabel(`/place/${entityId}.json`);
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

  return organisationData.map((organisation) => {
    // Add countryPrefLabel with langmap prefLabel
    organisation.countryPrefLabel = organisationCountriesPrefLabels[organisation.country] || organisation.country;

    return organisation;
  });
};

export {
  data,
  LOCALISE,
  PICK
};
