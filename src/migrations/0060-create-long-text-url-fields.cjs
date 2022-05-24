const urlFields = [
  { contentType: 'automatedEntityCard', id: 'image', name: 'Image', disabled: true },
  { contentType: 'automatedRecordCard', id: 'thumbnailUrl', name: 'Thumbnail URL', required: true, disabled: true, control: 'singleLine' },
  { contentType: 'curatedCard', id: 'url', required: true, control: 'singleLine' },
  { contentType: 'imageWithAttribution', id: 'url', validations:
    [{ regexp: { pattern: '^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-\\/]))?$' } }]
  },
  { contentType: 'link', id: 'url', required: true, control: 'singleLine', validations:
    [{
      regexp: { pattern: '^(((ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-\\/]))?)|(\\/|\\/([\\w#!:.?+=&%@!\\-\\/])*))$' },
      message: 'Must be a URL or a URL path starting with "/"'
    }]
  },
  { contentType: 'person', id: 'url' }
];

module.exports = function(migration) {
  for (const urlField of urlFields) {
    // 1. delete original short-text field
    const contentType = migration.editContentType(urlField.contentType);
    contentType.editField(urlField.id).omitted(true);
    contentType.deleteField(urlField.id);

    // 2. disable editing of temporary short-text field
    const tmpFieldId = `${urlField.id}Tmp`;
    contentType.editField(tmpFieldId).disabled(true);

    // 3. create a new long-text field
    contentType.createField(urlField.id)
      .name(urlField.name || 'URL')
      .type('Text')
      .localized(false)
      .required(!!urlField.required)
      .validations(urlField.validations || [])
      .disabled(true)
      .omitted(false);
    contentType.changeFieldControl(urlField.id, 'builtin', urlField.control || 'urlEditor', {});

    // 4. populate temporary field from original
    migration.transformEntries({
      contentType: urlField.contentType,
      from: [tmpFieldId],
      to: [urlField.id],
      transformEntryForLocale: async(fromFields, currentLocale) => {
        if (currentLocale !== 'en-GB') {
          return;
        }

        const url = fromFields[tmpFieldId]?.[currentLocale];

        return {
          [urlField.id]: url
        };
      },
      shouldPublish: 'preserve'
    });

    // 5. Enable new field (if required)
    contentType.editField(urlField.id).disabled(!!urlField.disabled);
  }
};
