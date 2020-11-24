export default ({ $config }, inject) => {
  const pageHeadTitle = pageTitle => [pageTitle, $config.app.siteName].join(' | ');

  inject('pageHeadTitle', pageHeadTitle);
};
