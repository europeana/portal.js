import createClient from '../../plugins/contentful';
const contentfulClient = createClient();

export async function getLatestEntries(contentType, locale) {
  await contentfulClient.getEntries({
    locale,
    'content_type': contentType,
    order: '-fields.datePublished',
    limit: 4
  })
    .then((response) => {
      console.log('getLatestEntries', response.items, response.total);
      return {
        'entries': response.items,
        'total': response.total
      };
    }).catch(error => {
      throw error;
    });
}
