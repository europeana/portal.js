const fs = require('fs');

module.exports = async function (migration, { makeRequest }) {
  if (!process.env.TAGS_DATA_FILE_NAME) {
    console.log('No tags data file name specified in TAGS_DATA_FILE_NAME; aborting.');
    process.exit(1);
  }

  const tagsData = JSON.parse(await fs.readFileSync(process.env.TAGS_DATA_FILE_NAME));

  // 1. fetch category entries (created in migration 0071)
  const response = await makeRequest({
    method: 'GET',
    url: '/entries',
    params: {
      'content_type': 'category',
      limit: 1000
    }
  });

  for (const entry of response.items) {
    const categoryName = entry.fields.name['en-GB'];
    for (const tagData of tagsData) {
      if ((tagData.tag === categoryName) || (tagData.replace === categoryName)) {
        tagData.id = entry.sys.id;
      }
    }
  }

  for (const tagData of tagsData) {
    if (tagData.replace) {
      const tagReplacement = tagsData.find((tagReplacementData) => tagReplacementData.tag === tagData.replace);
      if (tagReplacement && tagReplacement.entity) {
        tagData.entity = tagReplacement.entity;
      }
    }
  }

  // 2. Link blogPosting entries to categories & entities
  migration.transformEntries({
    contentType: 'blogPosting',
    from: ['identifier', 'keywords', 'relatedLink'],
    to: ['categories', 'relatedLink'],
    transformEntryForLocale: async(fields, locale) => {
      if (locale !== 'en-GB') {
        return;
      }

      const categories = [];
      const relatedLink = fields.relatedLink?.[locale] || [];

      for (const keyword of (fields.keywords?.[locale] || [])) {
        const tagData = tagsData.find((t) => t.tag === keyword.trim());
        if (!tagData) {
          console.warn(`Tag not found for entry ${fields.identifier[locale]}: "${keyword}"`);
        } else if (tagData.delete) {
          // Do nothing with it
        } else if (tagData.entity) {
          if (!relatedLink.includes(tagData.entity) && relatedLink) {
            relatedLink.push(tagData.entity);
          }
        } else if (tagData.id) {
          if (!categories.find((category) => category.sys.id === tagData.id)) {
            categories.push({
              sys: {
                type: 'Link',
                linkType: 'Entry',
                id: tagData.id
              }
            });
          }
        } else {
          console.warn(`Failed to detect action for entry ${fields.identifier[locale]}, keyword "${keyword}", tag data ${tagData}`);
        }
      }

      if (relatedLink.length > 5) {
        console.error(`Too many related entities (${relatedLink.length}) for entry ${fields.identifier[locale]}`);
      }

      return {
        categories,
        relatedLink: relatedLink.slice(0, 5)
      }
    },
    shouldPublish: 'preserve'
  });
};
