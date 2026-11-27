import { getCurrentInstance } from 'vue';

export default function useZohoCountries() {
  const instance = getCurrentInstance();
  const $root = instance.proxy.$root;

  const countryLabel = (country) => {
    if ($root.$i18n.te(`facets.COUNTRY.options.${country}`, 'en')) {
      return $root.$i18n.t(`facets.COUNTRY.options.${country}`);
    }
    if ($root.$i18n.te(`zoho.countries.${country}`, 'en')) {
      return $root.$i18n.t(`zoho.countries.${country}`);
    }
    return false;
  };

  return {
    countryLabel
  };
}
