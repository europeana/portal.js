module.exports = function(migration) {
  const voteableFeature = migration.editContentType('voteableFeature');

  voteableFeature
    .createField('id')
    .name('Identifier')
    .type('Symbol')
    .localized(true)
    .required(true)
    .validations([{ size: { max: 100 },
      message: 'Text must be max. 100 characters.' }])
    .disabled(false)
    .omitted(false);

  voteableFeature.changeFieldControl('id', 'builtin', 'slugEditor', {});

  voteableFeature
    .moveField('id')
    .afterField('name');
};
