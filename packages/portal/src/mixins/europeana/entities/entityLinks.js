import pick from 'lodash/pick';
import europeanaEntitiesOrganizationsMixin from '@/mixins/europeana/entities/organizations';

export default {
  mixins: [
    europeanaEntitiesOrganizationsMixin
  ],

  methods: {
    async fetchReducedEntities(entityUris) {
      const entities = await this.$apis.entity.find(entityUris);
      return entities.map(entity => pick(entity, ['id', 'prefLabel', 'isShownBy', 'logo', 'type']));
    },

    collectionTitle(collection) {
      let title;

      const organizationNativePrefLabel = this.organizationEntityNativeName(collection);
      if (organizationNativePrefLabel) {
        title = organizationNativePrefLabel;
      } else if (collection.prefLabel) {
        title = collection.prefLabel;
      } else {
        title = collection.name;
      }

      return title;
    },

    imageUrl(collection, imageWidth, imageHeight) {
      console.log('url', collection.primaryImageOfPage?.image?.url)
      if (this.$contentful.assets.isValidUrl(collection.primaryImageOfPage?.image?.url)) {
        return this.$contentful.assets.optimisedSrc(
          collection.primaryImageOfPage.image,
          { w: imageWidth, h: imageHeight, fit: 'thumb' }
        );
      }
      return this.$apis.entity.imageUrl(collection);
    }
  }
};
