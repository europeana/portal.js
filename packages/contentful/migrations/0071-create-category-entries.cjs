const fs = require('fs');

const tagSlug = (tag) => tag.toLowerCase().replace(/\W/g, '-').replace(/(^-|-$)/, '');

module.exports = async function (migration, { makeRequest }) {
  if (!process.env.TAGS_DATA_FILE_NAME) {
    console.log('No tags data file name specified in TAGS_DATA_FILE_NAME; aborting.');
    process.exit(1);
  }

  const tagsData = JSON.parse(await fs.readFileSync(process.env.TAGS_DATA_FILE_NAME));

  for (const tagData of tagsData) {
    if (tagData.replace) {
      const tagReplacement = tagsData.find((tagReplacementData) => tagReplacementData.tag === tagData.replace);
      if (tagReplacement && tagReplacement.entity) {
        tagData.entity = tagReplacement.entity;
      }
    }
  }

  const tagsToCreate = tagsData.filter((t) => !t.delete && !t.entity && !t.replace);
  const tagsToReplace = tagsData.filter((t) => t.replace && !t.entity);
  for (const tToReplace of tagsToReplace) {
    if (!tagsToCreate.find((tToCreate) => tToCreate.tag === tToReplace.replace)) {
      tagsToCreate.push({ tag: tToReplace.replace });
    }
  }

  // Create & publish category entries
  for (const tagData of tagsToCreate) {
    const response = await makeRequest({
      method: 'POST',
      url: '/entries',
      headers: {
        'X-Contentful-Content-Type': 'category'
      },
      data: {
        fields: {
          name: {
            'en-GB': tagData.tag
          },
          identifier: {
            'en-GB': tagSlug(tagData.tag)
          }
        }
      }
    });

    await makeRequest({
      method: 'PUT',
      url: `/entries/${response.sys.id}/published`,
      headers: {
        'X-Contentful-Version': response.sys.version
      }
    });
  }
};
