module.exports = function(migration) {
  const heroHeader = migration
    .createContentType('heroHeader')
    .name('Hero Header')
    .description('Hero with text and image.')
    .displayField('title');

  heroHeader
    .createField('title')
    .name('Title')
    .type('Symbol')
    .localized(true)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  heroHeader
    .createField('headline')
    .name('Headline')
    .type('Symbol')
    .localized(true)
    .required(true)
    .validations([
      {
        size: {
          max: 50
        }
      }
    ])
    .disabled(false)
    .omitted(false);

  heroHeader
    .createField('image')
    .name('Image')
    .type('Link')
    .localized(false)
    .required(true)
    .validations([
      {
        linkMimetypeGroup: ['imagewithAttribution']
      }
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Asset');

  heroHeader
    .createField('link')
    .name('Link')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        linkMimetypeGroup: ['link'],
        regexp: {
          pattern:
            '^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-\\/]))?$'
        }
      }
    ])
    .disabled(false)
    .omitted(false);

  const browsePage = migration.editContentType('browsePage');

  browsePage
    .editField('primaryImageOfPage')
    .validations([
      {
        linkContentType: ['heroHeader', 'imageWithAttribution']
      }
    ]);

};
