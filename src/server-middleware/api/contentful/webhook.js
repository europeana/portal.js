import flatten from 'lodash/flatten.js';
import * as contentful from 'contentful';
import { createRedisClient } from '../../../cachers/utils.js';

let contentfulClient;
let redisClient;

const linksToEntry = async(entry) => {
  if (!entry?.sys?.id) {
    return [];
  }

  const links = await contentfulClient.getEntries({
    'links_to_entry': entry.sys.id,
    include: 0
  });

  return links.items;
};

const deepLinksToEntry = async(entry) => {
  let deepLinks = [];
  const links = await linksToEntry(entry);
  for (const link of links) {
    deepLinks.push(link);
    const deeperLinks = await deepLinksToEntry(link);
    deepLinks = deepLinks.concat(deeperLinks);
  }
  return deepLinks;
};

const pageSlug = entry => (
  typeof entry.fields.identifier === 'string' ? entry.fields.identifier : entry.fields.identifier['en-GB']
);

const cachesToExpire = (entry) => {
  let caches = [];

  if (!entry?.sys?.contentType?.sys?.id) {
    return caches;
  }

  switch (entry.sys.contentType.sys.id) {
    case 'blogPosting':
      caches = [
        { key: 'blogFoyerPage' },
        { key: 'blogPostPage', entry }
      ];
      break;
    case 'browsePage':
    case 'staticPage':
      caches = [
        { key: 'browseStaticPage', entry }
      ];
      break;
    case 'entityPage':
      caches = [
        { key: 'collectionPage', entry }
      ];
      break;
    case 'exhibitionChapterPage':
      // TODO: are there other exhibition caches this needs to expire?
      caches = [
        { key: 'exhibitionChapterPage', entry }
      ];
      break;
    case 'exhibitionPage':
      caches = [
        { key: 'exhibitionFoyerPage' },
        { key: 'exhibitionLandingPage', entry },
        { key: 'exhibitionCreditsPage', entry }
      ];
      break;
    case 'imageGallery':
      caches = [
        { key: 'galleryFoyerPage' },
        { key: 'galleryPage', entry }
      ];
      break;
  }

  return caches;
};

const expireCache = async({ key, entry }) => {
  const cacheKeyPrefix = `@europeana:portal.js:contentful:${key}:`;
  const cacheKeyPattern = `${cacheKeyPrefix}*`;
  const keyMatches = await redisClient.keysAsync(cacheKeyPattern);
  for (const keyMatch of keyMatches) {
    const variables = new URLSearchParams(keyMatch.replace(cacheKeyPrefix, ''));

    const del = !entry || (variables.get('identifier') === pageSlug(entry));

    if (del) {
      redisClient.del(keyMatch);
    }
  }
};

// TODO: instead of just expiring cache entries, could this webhook instead
//       re-request from CTF and update the cached entries, saving client-initiated
//       requests from doing so?
// TODO: quit redis connection when done
export default ($config) => async(req, res) => {
  contentfulClient = contentful.createClient({
    space: $config.contentful.spaceId,
    environment: $config.contentful.environmentId,
    accessToken: $config.contentful.accessToken.delivery
  });
  redisClient = createRedisClient($config.redis);

  const entry = req.body;

  const expireEntries = [entry]
    .concat(await deepLinksToEntry(entry));

  const expire = flatten(expireEntries.map(cachesToExpire));

  for (const toExpire of expire) {
    expireCache(toExpire);
  }

  res.send('OK');
  res.end();
};
