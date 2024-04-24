import { getEntityTypeHumanReadable  } from '@/plugins/europeana/entity';
import { getLabelledSlug } from '@/plugins/europeana/utils';
import { BASE_URL as EUROPEANA_DATA_URL } from '@/plugins/europeana/data';

export default {
  methods: {
    collectionLinkGen(collection) {
      const uriMatch = collection.id?.match(`^${EUROPEANA_DATA_URL}/([^/]+)/(.+)$`);
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
      const uriMatch = uri.match(`^${EUROPEANA_DATA_URL}/([^/]+)/(.+)$`);
      return {
        name: 'collections-type-all', params: {
          type: getEntityTypeHumanReadable(uriMatch[1]),
          pathMatch: slug || uriMatch[2]
        }
      };
    }
  }
};
