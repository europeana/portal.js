module.exports = function(migration) {
  const imageTextSlide = migration
    .createContentType('imageTextSlide')
    .name('Image text slide')
    .description('An image with a text')
    .displayField('name');

  imageTextSlide
    .createField('name')
    .name('Name')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  imageTextSlide
    .createField('image')
    .name('Image')
    .type('Link')
    .localized(false)
    .required(true)
    .validations([
      {
        linkContentType: ['imageWithAttribution']
      }
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  imageTextSlide
    .createField('text')
    .name('Text')
    .type('Text')
    .localized(true)
    .required(false)
    .validations([{ size: { max: 200 },
      message: 'Text must be max. 200 characters.' }])
    .disabled(false)
    .omitted(false);

  imageTextSlide.changeFieldControl('image', 'builtin', 'entryLinkEditor', {
    helpText: 'Select an image with high resolution and good quality. For best quality it\'s advised to use images of at least 2,520 px width.'
  });
  imageTextSlide.changeFieldControl('text', 'builtin', 'markdown', {});

  const imageTextSlideGroup = migration
    .createContentType('imageTextSlideGroup')
    .name('Image text slide group')
    .description('A group of image text slides')
    .displayField('name');

  imageTextSlideGroup
    .createField('name')
    .name('Name')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  imageTextSlideGroup
    .createField('hasPart')
    .name('Slides')
    .type('Array')
    .localized(false)
    .required(true)
    .validations([
      {
        size: {
          min: 1,
          max: 3
        }
      }
    ])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',
      validations: [
        {
          linkContentType: ['imageTextSlide']
        }
      ],
      linkType: 'Entry'
    });

  const story = migration
    .editContentType('story');

  story
    .editField('hasPart')
    .name('Sections')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',
      validations: [
        {
          linkContentType: ['cardGroup', 'embed', 'imageComparison', 'imageTextSlideGroup', 'imageWithAttribution', 'link', 'richText']
        }
      ],
      linkType: 'Entry'
    });
};
