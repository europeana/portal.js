module.exports = function(migration) {
  const imageTextSlide = migration
    .editContentType('imageTextSlide');

  imageTextSlide
    .createField('attribution')
    .name('Quote Attribution')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([{ size: { max: 100 },
      message: 'Attribution must be max. 100 characters.' }])
    .disabled(false)
    .omitted(false);

  imageTextSlide.changeFieldControl('attribution', 'builtin', 'singleLine', {
    helpText: 'When present the card will be shown as a quote. Can cause the text to be truncated if it\'s longer than 160 characters.'
  });
};
