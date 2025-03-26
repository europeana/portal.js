const features = [{
  name: 'itemMultiSelect',
  // TODO: update URL to search when multi-select is available there
  url: '/galleries/2'
}];

export const featureNotificationExpiration = (value) => {
  const date = new Date(value);
  return date.toString() === 'Invalid Date' ? null : date;
};

const featureNotificationExpired = (expiration) => {
  return expiration && (Date.now() >= expiration);
};

const featureNotificationSupportsLocale = (configLocales, uiLocale) => {
  return !configLocales || [].concat(configLocales).includes(uiLocale);
};

const findFeature = (name) => features.find((feature) => feature.name === name);

export const activeFeatureNotification = ({ $config, i18n } = {}) => {
  const config = $config?.app?.featureNotification || {};

  const feature = findFeature(config.name);

  const isActive = feature &&
    !featureNotificationExpired(config.expiration) &&
    featureNotificationSupportsLocale(config.locales, i18n?.locale);

  return isActive ? feature : null;
};

export default features;
