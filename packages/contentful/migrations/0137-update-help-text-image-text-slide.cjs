module.exports = function(migration) {
  const imageTextSlide = migration
    .editContentType('imageTextSlide');

  imageTextSlide.changeFieldControl('citation', 'builtin', 'singleLine', {
    helpText: 'When present the text and attribution will be shown as a quote.'
  });
};
