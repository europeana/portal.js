module.exports = function(migration) {
  const voteableFeature = migration.editContentType('voteableFeature');

  voteableFeature
    .createField('identifier')
    .name('Identifier')
    .type('Symbol')
    .localized(true)
    .required(true)
    .validations([{ size: { max: 100 },
      message: 'Text must be max. 100 characters.' }])
    .disabled(false)
    .omitted(false);

  voteableFeature.changeFieldControl('identifier', 'builtin', 'slugEditor', {});

  voteableFeature
    .moveField('identifier')
    .afterField('name');
};
