import { getEntityTypeHumanReadable  } from '@/utils/europeana/entity.js';
import { getLabelledSlug } from '@europeana/utils';

export default {
  methods: {
    collectionLinkGen(collection) {
      const uriMatch = collection.id?.match(`^${this.$apis?.data?.BASE_URL}/([^/]+)/(.+)$`);
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
      const uriMatch = uri.match(`^${this.$apis?.data?.BASE_URL}/([^/]+)/(.+)$`);
      return {
        name: 'collections-type-all', params: {
          type: getEntityTypeHumanReadable(uriMatch[1]),
          pathMatch: slug || uriMatch[2]
        }
      };
    }
  }
};
