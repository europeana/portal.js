import { getEntityTypeHumanReadable  } from '@/plugins/europeana/entity';
import { getLabelledSlug } from '@/plugins/europeana/utils.js';
import { BASE_URL as EUROPEANA_DATA_URL } from '@/plugins/europeana/data';

export default {
  methods: {
    collectionLinkGen(collection) {
      const id = collection.id || collection.about;
      const uriMatch = id.match(`^${EUROPEANA_DATA_URL}/([^/]+)/(.+)$`);
      if (!uriMatch) {
        return null;
      }

      const prefLabelEn = [].concat(collection.prefLabel.en)[0];

      return {
        name: 'collections-type-all', params: {
          type: getEntityTypeHumanReadable(uriMatch[1]),
          pathMatch: getLabelledSlug(id, prefLabelEn)
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
