module.exports = function(migration) {
  const browsePage = migration.editContentType('browsePage');

  browsePage
    .editField('primaryImageOfPage')
    .name('Hero image')
    .validations([
      {
        linkContentType: ['heroBanner', 'imageWithAttribution']
      }
    ]);

  browsePage
    .editField('identifier')
    .validations([
      {
        unique: true
      },
      {
        prohibitRegexp: {
          pattern: '^(blog$|blog/|entity/|exhibitions?$|exhibition/|record/|search$)',
          flags: null
        },
        message: 'This URL slug is reserved.'
      }
    ]);

  browsePage
    .changeFieldId('headline', 'name');
  browsePage
    .displayField('name');
  browsePage
    .moveField('name')
    .toTheTop();

  browsePage
    .createField('description')
    .name('Description')
    .type('Symbol')
    .localized(true)
    .required(false)
    .disabled(false)
    .omitted(false);
  browsePage
    .changeFieldControl('description', 'builtin', 'singleLine', {
      helpText: 'For SEO, please make sure there is a short description.'
    });
  browsePage
    .moveField('description')
    .afterField('identifier');

  migration.transformEntries({
    contentType: 'browsePage',
    from: ['text'],
    to: ['description'],
    transformEntryForLocale: (fromFields, currentLocale) => {
      if (!fromFields.text) {
        return;
      }
      const text = fromFields.text[currentLocale];
      if (typeof text === 'undefined') {
        return;
      }
      const description = (text.length <= 255) ? text : text.slice(0, 253) + '…';
      return { description };
    }
  });

  browsePage.deleteField('text');

  browsePage
    .createField('headline')
    .name('Headline')
    .type('Symbol')
    .localized(true)
    .disabled(false)
    .omitted(false);
  browsePage.changeFieldControl('headline', 'builtin', 'singleLine', {
    helpText: 'Headline to use on the hero banner.'
  });
  browsePage
    .moveField('headline')
    .afterField('description');
};
