import { getCurrentInstance } from 'vue';
import { langMapValueForLocale } from '@europeana/i18n';
import useMakeToast from '@/composables/makeToast.js';

export function usePinnedItems() {
  const instance = getCurrentInstance();
  const $root = instance.proxy.$root;
  const nuxtContext = $root.$nuxt?.context;

  const { makeToast } = useMakeToast();

  const pin = async(itemId, entityId) => {
    console.log('pin', itemId, entityId);
    // first, retrieve full entity for prefLabel for set title, & toast
    const retrieveResponse = await nuxtContext.$apis.entity.retrieve([entityId]);
    const entity = retrieveResponse[0];
    const title = Object.entries(entity?.prefLabel || {}).reduce((memo, [lang, value]) => {
      memo[lang] = Array.isArray(value) ? value[0] : value;
      return memo;
    }, {});

    // find the EntityItemsBestSet for the entityId
    const searchResponse = await nuxtContext.$apis.set.search({
      profile: 'items',
      query: 'type:EntityBestItemsSet',
      qf: `subject:${entityId}`
    });
    let entityBestItemsSetId = searchResponse.items?.[0] || null;

    if (!entityBestItemsSetId) {
      // no such set exists: create one
      const setBody = {
        type: 'EntityBestItemsSet',
        title,
        subject: [entityId]
      };
      const createResponse = await nuxtContext.$apis.set.create(setBody);
      entityBestItemsSetId = createResponse.id;
    }

    // now, fetch the full set to check if it's already full
    const entityBestItemsSet = await nuxtContext.$apis.set.requestSet(entityBestItemsSetId);

    if (entityBestItemsSet.pinned >= 24) {
      $root.$bvModal.show(`pinned-limit-modal-${itemId}`);
      return;
    }

    // pin item to set
    await nuxtContext.$apis.set.pinItem(entityBestItemsSetId, itemId);
    const entityPrefLabel = langMapValueForLocale(entity.prefLabel, $root.$i18n.locale).values[0];
    makeToast($root.$i18n.t('entity.notifications.pinned', { entity: entityPrefLabel }));
  };

  const unpin = async(itemId, entityId) => {
    // find the EntityItemsBestSet for the entityId
    const searchResponse = await nuxtContext.$apis.set.search({
      profile: 'items',
      query: 'type:EntityBestItemsSet',
      qf: `subject:${entityId}`
    });
    const entityBestItemsSetId = searchResponse.items?.[0] || null;
    if (!entityBestItemsSetId) {
      throw new Error('Not Found');
    }

    await nuxtContext.$apis.set.deleteItems(entityBestItemsSetId, itemId);
    makeToast($root.$i18n.t('entity.notifications.unpinned'));
  };

  return {
    pin,
    unpin
  };
}
