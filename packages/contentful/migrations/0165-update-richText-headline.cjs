module.exports = function (migration) {
  const richText = migration
    .editContentType('richText');

  richText
    .editField('headline')
    .name('Name')
    .localized(false);

  richText.changeFieldControl(
    'headline',
    'builtin',
    'singleLine',
    {
      helpText: 'For editorial context only.'
    }
  );
};
