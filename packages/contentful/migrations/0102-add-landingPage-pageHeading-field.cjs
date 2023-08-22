module.exports = async function(migration) {
  const landingPage = migration
    .editContentType('landingPage');

  landingPage
    .editField('name')
    .validations([
      {
        unique: true
      },
      {
        size: {
          max: 100
        },
        message: 'This is a page title field, it needs to be unique for SEO and not more than 100 characters.'
      }
    ]);

  landingPage.changeFieldControl('name', 'builtin', 'singleLine', {
    helpText: 'This is the title used for SEO, in the browser tab and when sharing on social media. The H1 for this page has a separate field: Page heading'
  });

  landingPage
    .createField('pageHeading')
    .name('Page heading')
    .type('Symbol')
    .localized(true)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  landingPage.changeFieldControl('pageHeading', 'builtin', 'singleLine', {
    helpText: 'This is the H1 of the page. It may include markdown. Use underscores to highlight part of the title. For example "This page is _awesome_"'
  });

  landingPage
    .moveField('pageHeading')
    .afterField('name');
};
