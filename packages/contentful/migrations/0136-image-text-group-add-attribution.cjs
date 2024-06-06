module.exports = function(migration) {
  const imageTextSlide = migration
    .editContentType('imageTextSlide');

  imageTextSlide
    .createField('citation')
    .name('Quote Attribution')
    .type('Symbol')
    .localized(true)
    .required(false)
    .validations([{ size: { max: 100 },
      message: 'Quote Attribution must be max. 100 characters.' }])
    .disabled(false)
    .omitted(false);

  imageTextSlide.changeFieldControl('citation', 'builtin', 'singleLine', {
    helpText: 'When present the text and attribution will be shown as a quote. Text longer than 160 characters will be truncated.'
  });
};
