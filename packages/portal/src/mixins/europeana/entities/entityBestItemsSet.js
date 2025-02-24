export default {
  data() {
    return {
      entityBestItemsSetPinnedItems: []
    };
  },

  methods: {
    async ensureEntityBestItemsSetExists(setId, entity) {
      if (setId) {
        // TODO: validate if set exists and is for the entity?
        return setId;
      }

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
        memo[lang] = Array.isArray(value) ? value[0] : value;
        return memo;
      }, {});
    },

    async fetchEntityBestItemsSetPinnedItems(entityBestItemsSetId) {
      if (!entityBestItemsSetId) {
        return;
      }
      await Promise.all([
        this.$apis.set.get(entityBestItemsSetId),
        this.$apis.set.getItemIds(entityBestItemsSetId)
      ]).then((responses) => {
        this.storeEntityBestItemsSetPinnedItems({
          ...responses[0],
          items: responses[1]
        });
      });
    },

    storeEntityBestItemsSetPinnedItems(entityBestItemsSet) {
      if ((entityBestItemsSet.pinned > 0) && entityBestItemsSet.items) {
        this.$store.commit('entity/setPinned', entityBestItemsSet.items.slice(0, entityBestItemsSet.pinned));
      } else {
        this.$store.commit('entity/setPinned', []);
      }
    },

    async findEntityBestItemsSet(entityId) {
      const searchResponse = await this.$apis.set.search({
        profile: 'items',
        query: 'type:EntityBestItemsSet',
        qf: `subject:${entityId}`
      });

      if (searchResponse.total > 0) {
        return searchResponse.items[0].split('/').pop();
      } else {
        return null;
      }
    },

    async pinItemToEntityBestItemsSet(itemId, entityBestItemsSetId, entityPrefLabel) {
      await this.fetchEntityBestItemsSetPinnedItems(entityBestItemsSetId);
      if (this.$store.state.entity.pinned && (this.$store.state.entity.pinned.length >= 24)) {
        // TODO: why aren't we using makeToast here?
        this.$bvModal.show(`pinned-limit-modal-${itemId}`);
        return;
      }
      await this.$apis.set.pinItem(entityBestItemsSetId, itemId);
      this.makeToast(this.$t('entity.notifications.pinned', { entity: entityPrefLabel }));
    },

    async unpinItemFromEntityBestItemsSet(itemId, entityBestItemsSetId) {
      await this.$apis.set.deleteItem(entityBestItemsSetId, itemId);
      this.makeToast(this.$t('entity.notifications.unpinned'));
    }
  }
};
