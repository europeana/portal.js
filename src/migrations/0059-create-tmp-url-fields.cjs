const urlFields = [
  { contentType: 'automatedEntityCard', id: 'image', name: 'Image', disabled: true },
  { contentType: 'automatedRecordCard', id: 'thumbnailUrl', name: 'Thumbnail URL', required: true, disabled: true, control: 'singleLine' },
  { contentType: 'curatedCard', id: 'url', required: true, control: 'singleLine' },
  { contentType: 'imageWithAttribution', id: 'url', validations:
    [{ regexp: { pattern: '^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?$' } }]
  },
  { contentType: 'link', id: 'url', required: true, control: 'singleLine', validations:
    [{
      regexp: { pattern: '^(((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)|(\/|\/([\w#!:.?+=&%@!\-\/])*))$' },
      message: 'Must be a URL or a URL path starting with "/"'
    }]
  },
  { contentType: 'person', id: 'url' }
];

module.exports = function(migration) {
  for (const urlField of urlFields) {
    // 1. disable editing of original short-text field
    const contentType = migration.editContentType(urlField.contentType);
    contentType.editField(urlField.id).disabled(true);

    // 2. create a temporary short-text field
    const tmpFieldId = `${urlField.id}Tmp`;
    contentType.createField(tmpFieldId)
      .name(urlField.name || 'URL')
      .type('Symbol')
      .localized(false)
      .required(!!urlField.required)
      .validations(urlField.validations || [])
      .disabled(!!urlField.disabled)
      .omitted(false);
    contentType.changeFieldControl(tmpFieldId, 'builtin', urlField.control || 'urlEditor', {});

    // 3. populate temporary field from original
    migration.transformEntries({
      contentType: urlField.contentType,
      from: [urlField.id],
      to: [tmpFieldId],
      transformEntryForLocale: async(fromFields, currentLocale) => {
        if (currentLocale !== 'en-GB') {
          return;
        }

        const url = fromFields[urlField.id]?.[currentLocale];

        return {
          [tmpFieldId]: url
        };
      },
      shouldPublish: 'preserve'
    });
  }
};
