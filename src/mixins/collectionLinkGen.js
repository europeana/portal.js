import { getEntityTypeHumanReadable, getEntitySlug  } from '@/plugins/europeana/entity';
import { BASE_URL as EUROPEANA_DATA_URL } from '@/plugins/europeana/data';

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
          pathMatch: getEntitySlug(collection.id, collection.prefLabel.en)
        }
      });
    }
  }
};
