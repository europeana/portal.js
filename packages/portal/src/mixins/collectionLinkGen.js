import { EUROPEANA_DATA_API_BASE_URL } from '@europeana/apis';
import { getLabelledSlug } from '@europeana/utils';
import { getEntityTypeHumanReadable  } from '@/utils/europeana/entity.js';

export default {
  methods: {
    collectionLinkGen(collection) {
      const uriMatch = collection.id?.match(`^${EUROPEANA_DATA_API_BASE_URL}/([^/]+)/(.+)$`);
      if (!uriMatch) {
        return null;
      }

      return {
        name: 'collections-type-all', params: {
          type: getEntityTypeHumanReadable(uriMatch[1]),
          pathMatch: getLabelledSlug(collection.id, collection.prefLabel.en)
        }
      };
    },

    entityRouterLink(uri, slug) {
      const uriMatch = uri.match(`^${EUROPEANA_DATA_API_BASE_URL}/([^/]+)/(.+)$`);
      if (!uriMatch) {
        return null;
      }

      return {
        name: 'collections-type-all', params: {
          type: getEntityTypeHumanReadable(uriMatch[1]),
          pathMatch: slug || uriMatch[2]
        }
      };
    }
  }
};
