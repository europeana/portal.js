const urlFields = [
  { contentType: 'automatedEntityCard', id: 'image' },
  { contentType: 'automatedRecordCard', id: 'thumbnailUrl' },
  { contentType: 'curatedCard', id: 'url' },
  { contentType: 'imageWithAttribution', id: 'url' },
  { contentType: 'link', id: 'url' },
  { contentType: 'person', id: 'url' }
];

module.exports = function(migration) {
  for (const urlField of urlFields) {
    // 1. delete temporary short-text field
    const contentType = migration.editContentType(urlField.contentType);
    const tmpFieldId = `${urlField.id}Tmp`;
    contentType.editField(tmpFieldId).omitted(true);
    contentType.deleteField(tmpFieldId);
  }
};
