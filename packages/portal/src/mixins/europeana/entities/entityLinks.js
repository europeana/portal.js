import europeanaEntitiesOrganizationsMixin from '@/mixins/europeana/entities/organizations';

export default {
  mixins: [
    europeanaEntitiesOrganizationsMixin
  ],

  methods: {
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
    }
  }
};
