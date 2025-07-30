const contentTypeDef = { id: 'blogPosting', sites: ['www.europeana.eu', 'dataspace-culturalheritage.eu'] };

module.exports = function(migration) {
  const contentType = migration.editContentType(contentTypeDef.id);

  contentType
    .createField('site')
    .name('Site')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        in: contentTypeDef.sites
      }
    ])
    .defaultValue({
      'en-GB': contentTypeDef.sites[0]
    })
    .disabled(false)
    .omitted(false);

  contentType.changeFieldControl('site', 'builtin', 'dropdown');

  contentType.moveField('site').afterField('name');

  migration.transformEntries({
    contentType: contentTypeDef.id,
    from: ['site'],
    to: ['site'],
    transformEntryForLocale: async(from, locale) => {
      // Don't check from field since it's just been created?
      if (locale !== 'en-GB' || from.site?.[locale]) {
        return;
      }
      return {
        site: contentTypeDef.sites[0]
      };
    }
  });
};
