import pagePlugin from '../../../src/plugins/page';

describe('pageHeadTitle', () => {
  it('appends site name to supplied page title', () => {
    const pageTitle = 'About us';
    const siteName = 'Europeana';
    const expected = 'About us | Europeana';

    let pageHeadTitle;
    pagePlugin(
      { $config: { app: { siteName } } },
      (name, fn) => pageHeadTitle = fn
    );
    const pageTitleWithSiteName = pageHeadTitle(pageTitle);

    pageTitleWithSiteName.should.eq(expected);
  });
});
