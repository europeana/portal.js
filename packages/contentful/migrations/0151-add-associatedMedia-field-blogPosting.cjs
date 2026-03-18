module.exports = function(migration) {
  const contentType = migration.editContentType('blogPosting');

  contentType
    .createField('associatedMedia')
    .name('Associated media')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',
      validations: [],
      linkType: 'Asset',
    });

  contentType.changeFieldControl(
    'associatedMedia',
    'builtin',
    'assetLinksEditor',
    {}
  );

  contentType.moveField('associatedMedia').afterField('hasPart');
};
