import uniq from 'lodash/uniq.js';
// TODO: remove and uninstall when deprecated after API released with place references for countries
// FIXME: has this happened now?
import countryCodes from 'i18n-iso-countries';
import { codes as localeCodes } from '@europeana/i18n';

import baseData from './index.js';
import { createEuropeanaApiClient } from '../utils.js';
import { isEntityUri } from '../../plugins/europeana/entity.js';
import {
  organizationEntityNativeName,
  organizationEntityNonNativeEnglishName
} from '../../utils/europeana/entities/organizations.js';

const PICK = ['id', 'slug', 'recordCount', 'prefLabel', 'altLabel', 'countryPrefLabel'];
const LOCALISE = 'countryPrefLabel';

let axiosClient;

async function getCountryPrefLabel(entityUrl) {
  // TODO: memoise
  const response = await axiosClient.get(entityUrl);
  return response.data.prefLabel;
}

const data = async(config = {}) => {
  const organisationData = await baseData({ type: 'organization' }, config);

  axiosClient = createEuropeanaApiClient(config.europeana?.apis?.entity);

  // Get array with all unique countries to only have to request prefLabels once
  const organisationCountries = uniq(organisationData.map(organisation => organisation.country));

  const organisationCountriesPrefLabels = {};
  for (const country of organisationCountries) {
    // FIXME: are production & acceptance APIs consistent now?
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
    (organisation) => ({
      ...organisation,
      // Keep isAggregatedBy.recordCount as recordCount
      // TODO: add to other entity-type cachers too
      recordCount: organisation.isAggregatedBy?.recordCount || 0,
      // Add countryPrefLabel with langmap prefLabel
      countryPrefLabel: organisationCountriesPrefLabels[organisation.country?.id || organisation.country] || organisation.country,
      // Store as prefLabel the native name, as altLabel the English name (if non-native)
      altLabel: organizationEntityNonNativeEnglishName(organisation),
      prefLabel: organizationEntityNativeName(organisation)
    })
  );
};

export {
  data,
  LOCALISE,
  PICK
};
