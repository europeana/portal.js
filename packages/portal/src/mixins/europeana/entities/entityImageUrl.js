import getWikimediaThumbnailUrl from '@europeana/apis/src/apis/entity/index.js';

export default {
  methods: {
    entityImageUrl(entity) {
      let url = null;

      // `image` is a property on automated entity cards in Contentful
      if (entity?.image) {
        url = this.$apis?.thumbnail?.edmPreview(entity.image, { size: 200 });
      // `isShownBy` is a property on most entity types
      } else if (entity?.isShownBy?.thumbnail) {
        url = this.$apis?.thumbnail?.edmPreview(entity.isShownBy.thumbnail, { size: 200 });
      // `logo` is a property on organization-type entities
      } else if (entity?.logo?.id) {
        url = getWikimediaThumbnailUrl(entity.logo.id, 28);
      }

      return url;
    }
  }
};
