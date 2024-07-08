const MurmurHash3 = require('imurmurhash');

module.exports = async function(migration, { makeRequest }) {
  // Get the Providing institutions infoCardGroup.
  const response = await makeRequest({
    method: 'GET',
    url: '/entries',
    params: {
      'content_type': 'infoCardGroup',
      'fields.name[match]': 'Providing institutions',
      limit: 1
    }
  });

  const infoCardGroupId = response.items[0]?.sys?.id;

  // Get the infoCards from the Providing institutions infoCardGroup.
  const infoCardsIds = response.items[0]?.fields?.hasPart['en-GB'].map((entry) => entry.sys.id);

  // Temporarily allow infoCardGroup to have illustrations to update references and link them to the new illustrationGroup.
  migration.editContentType('infoCardGroup')
    .editField('hasPart')
    .items({
      type: 'Link',
      validations: [
        {
          linkContentType: ['infoCard', 'illustration']
        }
      ],
      linkType: 'Entry'
    });

  // Transform the infoCards from the Providing institutions infoCardGroup to illustrations.
  migration.transformEntriesToType({
    sourceContentType: 'infoCard',
    targetContentType: 'illustration',
    shouldPublish: true,
    updateReferences: true,
    removeOldEntries: true,
    identityKey(fields) {
      const value = fields.name['en-GB'].toString();
      return MurmurHash3(value).result().toString();
    },

    transformEntryForLocale(fromFields, currentLocale, { id }) {
      if (infoCardsIds.includes(id)) {
        return {
          name: fromFields.name ? fromFields.name[currentLocale] : undefined,
          image: fromFields.image ? fromFields.image[currentLocale] : undefined
        };
      }
    }
  });

  // Transform the Providing institutions infoCardGroup to an illustrationGroup.
  migration.transformEntriesToType({
    sourceContentType: 'infoCardGroup',
    targetContentType: 'illustrationGroup',
    shouldPublish: true,
    updateReferences: true,
    removeOldEntries: true,
    identityKey(fields) {
      const value = fields.name['en-GB'].toString();
      return MurmurHash3(value).result().toString();
    },
    transformEntryForLocale(fromFields, currentLocale, { id }) {
      if (id === infoCardGroupId) {
        return {
          name: fromFields.name ? fromFields.name[currentLocale] : undefined,
          text: fromFields.text ? fromFields.text[currentLocale] : undefined,
          hasPart: fromFields.hasPart ? fromFields.hasPart[currentLocale] : undefined
        };
      }
    }
  });

  // Remove the illustrations as linked content type from the infoCardGroup.
  migration.editContentType('infoCardGroup')
    .editField('hasPart')
    .items({
      type: 'Link',
      validations: [
        {
          linkContentType: ['infoCard']
        }
      ],
      linkType: 'Entry'
    });
};
