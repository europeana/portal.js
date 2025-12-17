module.exports = function(migration) {
  const contentType = migration.editContentType('blogPosting');

  contentType
    .createField('introduction')
    .name('Introduction')
    .type('Text')
    .localized(true)
    .required(false)
    .validations([
      {
        size: { max: 550 }
      }
    ])
    .disabled(false)
    .omitted(false);

  contentType.changeFieldControl('introduction', 'builtin', 'markdown');

  contentType.moveField('introduction').afterField('description');
};
