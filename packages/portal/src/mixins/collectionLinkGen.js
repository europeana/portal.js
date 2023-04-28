import { getEntityTypeHumanReadable  } from '@europeana/apis/src/entity.js';
import { getLabelledSlug } from '@europeana/apis/src/utils.js';
import { BASE_URL as EUROPEANA_DATA_URL } from '@europeana/apis/src/data.js';

export default {
  methods: {
    collectionLinkGen(collection) {
      const uriMatch = collection.id?.match(`^${EUROPEANA_DATA_URL}/([^/]+)/(.+)$`);
      if (!uriMatch) {
        return null;
      }

      return this.$path({
        name: 'collections-type-all', params: {
          type: getEntityTypeHumanReadable(uriMatch[1]),
          pathMatch: getLabelledSlug(collection.id, collection.prefLabel.en)
        }
      });
    },
    entityRouterLink(uri, slug) {
      const uriMatch = uri.match(`^${EUROPEANA_DATA_URL}/([^/]+)/(.+)$`);
      return {
        name: 'collections-type-all', params: {
          type: getEntityTypeHumanReadable(uriMatch[1]),
          pathMatch: slug ? slug : uriMatch[2]
        }
      };
    }
  }
};
