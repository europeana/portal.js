module.exports = function (migration) {
  const primaryCallToAction = migration
    .editContentType('primaryCallToAction');

  primaryCallToAction
    .editField('name')
    .localized(true);

  primaryCallToAction.changeFieldControl('name', 'builtin', 'singleLine', {
    helpText: ''
  });
};
