import pick from 'lodash/pick';
import { withEditorialContent } from '@/plugins/europeana/themes';
import europeanaEntitiesOrganizationsMixin from '@/mixins/europeana/entities/organizations';

export default {
  mixins: [
    europeanaEntitiesOrganizationsMixin
  ],

  methods: {
    async fetchEntitiesWithEditorialOverrides(entityUris) {
      let entities = await this.$apis.entity.find(entityUris);
      entities = entities.map(entity => pick(entity, ['id', 'prefLabel', 'isShownBy', 'logo', 'type']));
      const collectionsWithOverrides = await withEditorialContent(this, entities);
      return collectionsWithOverrides;
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
      if (collection.contentfulImage && this.$contentful.assets.isValidUrl(collection.contentfulImage.url)) {
        return this.$contentful.assets.optimisedSrc(
          collection.contentfulImage,
          { w: imageWidth, h: imageHeight, fit: 'thumb' }
        );
      }
      return this.$apis.entity.imageUrl(collection);
    }
  }
};
