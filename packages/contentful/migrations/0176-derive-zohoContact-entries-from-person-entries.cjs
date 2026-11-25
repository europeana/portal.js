// env var CONTENTFUL_ZOHO_IDS_FILE_NAME points to a file with a json array
// of objects mapping existing contentful person entry ids to zoho CRM contact ids:
//
// [
//   {
//     "contentfulId": "1606125fb8f9fe2f2a16cc7b2138cbe9",
//     "zohoId": "486281000001029033"
//   },
//   {
//     "contentfulId": "02b121eebe67db3273411add90af6e47",
//     "zohoId": "486281000001029012"
//   }
// ]

const fs = require('fs');

module.exports = async function(migration) {
  if (!process.env.CONTENTFUL_ZOHO_IDS_FILE_NAME) {
    console.error('No Contentful-Zoho IDs file name specified in CONTENTFUL_ZOHO_IDS_FILE_NAME; aborting.');
    process.exit(1);
  }

  const items = JSON.parse(await fs.readFileSync(process.env.CONTENTFUL_ZOHO_IDS_FILE_NAME));

  // temporary field to be used in the derivation of linked entries
  const person = migration.editContentType('person');
  person
    .createField('zohoId')
    .name('Zoho CRM ID')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        unique: true,
      },
    ])
    .disabled(false)
    .omitted(false);

  migration.transformEntries({
    contentType: 'person',
    from: [],
    to: ['zohoId'],
    transformEntryForLocale(fromFields, currentLocale, { id }) {
      if (currentLocale === 'en-GB') {
        const item = items.find((item) => item.contentfulId === id);
        if (item) {
          return { zohoId: item.zohoId };
        }
      }
    },
    shouldPublish: 'preserve'
  });

  migration.deriveLinkedEntries({
    contentType: 'person',
    derivedContentType: 'zohoContact',
    from: ['name', 'zohoId'],
    toReferenceField: 'zohoContact',
    derivedFields: ['name', 'identifier'],
    identityKey: async(fromFields) => {
      return `zohoContact-${fromFields.zohoId?.['en-GB']}`;
    },
    shouldPublish: true,
    deriveEntryForLocale: (fromFields, locale) => {
      if (locale !== 'en-GB') {
        return;
      }
      if (!fromFields.zohoId?.[locale] || !fromFields.name?.[locale]) {
        return;
      }

      return {
        name: fromFields.name[locale],
        identifier: fromFields.zohoId[locale]
      };
    }
  });

  person
    .deleteField('zohoId');
};
