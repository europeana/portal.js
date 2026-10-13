const MurmurHash3 = require('imurmurhash');

function transformEntriesToEntityGroup(migration, sourceContentType) {
  migration.transformEntriesToType({
    sourceContentType,
    targetContentType: 'entityGroup',
    shouldPublish: true,
    updateReferences: true,
    removeOldEntries: true,
    identityKey(fields) {
      const hashState = MurmurHash3(fields.headline['en-GB'].toString());
      for (const part of fields.hasPart['en-GB']) {
        hashState.hash(part.toString());
      }
      return hashState.result().toString();
    },
    transformEntryForLocale(fromFields, currentLocale) {
      return {
        headline: fromFields.headline?.[currentLocale],
        hasPart: fromFields.hasPart?.[currentLocale]
      };
    }
  });
}

module.exports = function(migration) {
  for (const sourceContentType of ['personGroup', 'topicGroup']) {
    transformEntriesToEntityGroup(migration, sourceContentType);
  }
};
