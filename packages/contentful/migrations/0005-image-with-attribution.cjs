module.exports = function(migration) {
  const imageWithAttribution = migration
    .createContentType('imageWithAttribution')
    .name('Image with attribution')
    .description('An image with attribution.')
    .displayField('name');
  imageWithAttribution
    .createField('name')
    .name('Name')
    .type('Symbol')
    .localized(true)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  imageWithAttribution
    .createField('image')
    .name('Image')
    .type('Link')
    .localized(false)
    .required(true)
    .validations([
      {
        linkMimetypeGroup: ['image']
      }
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Asset');

  imageWithAttribution
    .createField('creator')
    .name('Creator')
    .type('Symbol')
    .localized(true)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  imageWithAttribution
    .createField('provider')
    .name('Provider')
    .type('Symbol')
    .localized(true)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  imageWithAttribution
    .createField('license')
    .name('Rights statement')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        regexp: {
          pattern:
            '^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-\\/]))?$'
        }
      }
    ])
    .disabled(false)
    .omitted(false);

  imageWithAttribution
    .createField('url')
    .name('URL')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        regexp: {
          pattern:
            '^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-\\/]))?$'
        }
      }
    ])
    .disabled(false)
    .omitted(false);

  imageWithAttribution.changeFieldControl('name', 'builtin', 'singleLine', {});
  imageWithAttribution.changeFieldControl(
    'image',
    'builtin',
    'assetLinkEditor',
    {}
  );
  imageWithAttribution.changeFieldControl(
    'creator',
    'builtin',
    'singleLine',
    {}
  );
  imageWithAttribution.changeFieldControl(
    'provider',
    'builtin',
    'singleLine',
    {}
  );
  imageWithAttribution.changeFieldControl(
    'license',
    'builtin',
    'singleLine',
    {}
  );
  imageWithAttribution.changeFieldControl('url', 'builtin', 'urlEditor', {});

  imageWithAttribution
    .addSidebarWidget('extension', 'europeanaImageHarvester', {}, 'content-preview-widget');
};
