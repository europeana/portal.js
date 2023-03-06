export default {
  methods: {
    async createFeaturedSet(entity) {
      const entityId = entity.id || entity.about;
      const featuredSetBody = {
        type: 'EntityBestItemsSet',
        title: this.entitySetTitle(entity),
        subject: [entityId]
      };
      const response = await this.$apis.set.create(featuredSetBody);
      return response.id;
    },

    entitySetTitle(entity) {
      return Object.entries(entity?.prefLabel || {}).reduce((memo, [lang, value]) => {
        memo[lang] = this.$t('set.entityBestBets.title', { entity: Array.isArray(value) ? value[0] : value });
        return memo;
      }, {});
    }
  }
};
