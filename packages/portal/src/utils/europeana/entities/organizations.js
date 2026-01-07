const ENGLISH_LOCALE_CODE = 'en';

export const isNamedOrganizationEntity = (entity) => {
  return (entity?.type === 'Organization') && !!entity.prefLabel;
};

export const organizationEntityNativeName = (entity) => {
  if (!isNamedOrganizationEntity(entity)) {
    return null;
  }
  const nativeLocale = Object.keys(entity.prefLabel)
    .find(locale => locale !== ENGLISH_LOCALE_CODE) || ENGLISH_LOCALE_CODE;
  return { [nativeLocale]: entity.prefLabel[nativeLocale] };
};

export const organizationEntityNonNativeEnglishName = (entity) => {
  if (!isNamedOrganizationEntity(entity) || Object.keys(entity.prefLabel).length < 2) {
    return null;
  }

  return { [ENGLISH_LOCALE_CODE]: entity.prefLabel[ENGLISH_LOCALE_CODE] };
};
