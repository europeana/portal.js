// Identifies content entries in Contentful not linked to from other content
// entries.
//
// Usage:
// ```sh
// # From the monorepo root, richText content type, TSV format output:
// npm run -w packages/contentful strays richText headline tsv
//
// # From the package root, link content type, JSON format output (default):
// npm run strays link text
// ```

import axios from 'axios';

const graphqlQuery = (contentType, fields = []) => `
  query StrayContentEntries(
    $locale: String = "en-GB",
    $preview: Boolean = true,
    $limit: Int = 100,
    $skip: Int = 0
  ) {
    ${contentType}Collection(
      preview: $preview, locale: $locale, limit: $limit, skip: $skip
    ) {
      items {
        ${fields.join('\n')}
        sys {
          id
        }
        linkedFrom {
          entryCollection {
            total
          }
        }
      }
    }
  }
`;

const pageOfEntries = async(contentType, fields, page = 1) => {
  const query = graphqlQuery(contentType, fields);
  const limit = 100;
  const variables = {
    limit,
    skip: (page - 1) * limit
  };

  const response = await axios({
    method: 'post',
    url: `https://graphql.contentful.com/content/v1/spaces/${process.env.CTF_SPACE_ID}/environments/${process.env.CTF_ENVIRONMENT_ID}`,
    data: {
      query,
      variables
    },
    params: {
      'access_token': process.env.CTF_CPA_ACCESS_TOKEN
    }
  });
  return response.data;
};

const main = async() => {
  const contentType = process.argv[2] === 'richText' ? 'contentTypeRichText' : process.argv[2];
  const fields = process.argv[3] ? process.argv[3].split(',') : undefined;
  const format = process.argv[4] === 'tsv' ? process.argv[4] : 'json';

  const strays = [];
  let noMoreEntries = false;
  let page = 1;

  while (!noMoreEntries) {
    const responseData = await pageOfEntries(contentType, fields, page);
    const items = responseData.data[`${contentType}Collection`].items;

    if (items.length === 0) {
      noMoreEntries = true;
    } else {
      for (const item of items) {
        if (item.linkedFrom.entryCollection.total === 0) {
          delete item.linkedFrom;
          strays.push({
            ...item,
            sys: {
              ...item.sys,
              link: `https://app.contentful.com/spaces/${process.env.CTF_SPACE_ID}/environments/${process.env.CTF_ENVIRONMENT_ID}/entries/${item.sys.id}`
            }
          });
        }
      }
      page = page + 1;
    }
  }

  if (format === 'json') {
    console.log(JSON.stringify(strays, null, 2));
  } else {
    console.log(`ID\t${fields.join('\t')}\tLink`);
    for (const item of strays) {
      const output = [item.sys.id];
      for (const field of fields) {
        output.push(item[field]);
      }
      output.push(item.sys.link);
      console.log(output.join('\t'));
    }
  }
};

main();
