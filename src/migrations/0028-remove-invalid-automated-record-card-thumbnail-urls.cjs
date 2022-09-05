module.exports = (migration) => {
  migration.transformEntries({
    contentType: 'automatedRecordCard',
    from: ['thumbnailUrl'],
    to: ['thumbnailUrl'],
    transformEntryForLocale: (fromFields, currentLocale) => {
      if (currentLocale !== 'en-GB' || !fromFields.thumbnailUrl) {
        return;
      }
      if (fromFields.thumbnailUrl['en-GB'].length >= 256) {
        return { thumbnailUrl: 'REMOVED' };
      }
    },
    shouldPublish: 'preserve'
  });
};
