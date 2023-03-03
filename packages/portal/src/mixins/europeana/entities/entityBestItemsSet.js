export default {
  methods: {
    createFeaturedSet(entity) {
      const featuredSetBody = {
        type: 'EntityBestItemsSet',
        title: this.entitySetTitle(entity),
        subject: [entity.id]
      };
      console.log(featuredSetBody);
      return this.$apis.set.create(featuredSetBody)
        .then(response => response.id);
    },

    entitySetTitle(entity) {
      return Object.entries(entity?.prefLabel || {}).reduce((memo, [lang, value]) => {
        memo[lang] = this.$t('set.entityBestBets.title', { entity: Array.isArray(value) ? value[0] : value });
        return memo;
      }, {});
    }
  }
};
