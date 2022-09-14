module.exports = function(migration) {
  // Update identifier fields
  for (const contentType of ['automatedEntityCard', 'entityPage']) {
    migration.transformEntries({
      contentType,
      from: ['identifier'],
      to: ['identifier'],
      transformEntryForLocale: async(fromFields, currentLocale) => {
        if ((currentLocale !== 'en-GB') || !fromFields.identifier?.[currentLocale]) {
          return;
        }

        return {
          identifier: fromFields.identifier[currentLocale].replace('/base/', '/')
        };
      },
      shouldPublish: 'preserve'
    });
  }

  // Update relatedLink fields
  for (const contentType of ['blogPosting', 'exhibitionPage']) {
    migration.transformEntries({
      contentType,
      from: ['relatedLink'],
      to: ['relatedLink'],
      transformEntryForLocale: async(fromFields, currentLocale) => {
        if ((currentLocale !== 'en-GB') || !fromFields.relatedLink?.[currentLocale]) {
          return;
        }

        return {
          relatedLink: fromFields.relatedLink[currentLocale].map(uri => uri.replace('/base/', '/'))
        };
      },
      shouldPublish: 'preserve'
    });
  }
};
