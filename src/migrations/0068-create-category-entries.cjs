const fs = require('fs');

module.exports = async function (migration, { makeRequest }) {
  if (!process.env.TAGS_DATA_FILE_NAME) {
    console.log('No tags data file name specified in TAGS_DATA_FILE_NAME; aborting.');
    process.exit(1);
  }

  const tagsData = JSON.parse(await fs.readFileSync(process.env.TAGS_DATA_FILE_NAME));
  console.log(tagsData[0]);

  // 1. Create category entries

  // 2. Link exhibitionPage entries to categories based on keywords
  // migration.transformEntries({
  //   contentType: 'exhibitionPage',
  //   from: ['keywords'],
  //   to: ['categories'],
  //   transformEntryForLocale: async(fields, locale) => {
  //     if (locale !== 'en-GB') {
  //       return;
  //     }
  //
  //     const categories = [];
  //
  //     for (const tag of fields.keywords[locale]) {
  //       // fetch category entries for each keyword
  //       const response = await makeRequest({
  //         method: 'GET',
  //         url: '/entries',
  //         params: {
  //           'content_type': 'category',
  //           name: tag
  //         }
  //       });
  //
  //       // categories.push({
  //       //   sys: {
  //       //     type: 'Link',
  //       //     linkType: 'Entry',
  //       //     id: categoryId
  //       //   }
  //       // });
  //     }
  //
  //     return {
  //       categories: []
  //     }
  //   },
  //   shouldPublish: 'preserve'
  // });
};
