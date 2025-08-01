const contentTypeDef = { id: 'blogPosting', sites: ['dataspace-culturalheritage.eu'] };

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
};
