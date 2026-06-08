import { getCurrentInstance } from 'vue';
import { EventTarget, Event } from 'event-target-shim';

import { langMapValueForLocale } from '@europeana/i18n';
import useMakeToast from '@/composables/makeToast.js';

const ENTITY_ITEMS_BEST_SET = 'EntityBestItemsSet';

export class PinnedItemsError extends Error {
  static ENTITY_NOT_FOUND = 'Entity not found';
  static ENTITY_ITEMS_BEST_SET_NOT_FOUND = 'EntityBestItemsSet not found';

  constructor(message) {
    super(message);
    this.name = 'PinnedItemsError';
  }
}

export class ItemPinningEvent extends Event {
  constructor(type, itemId, entityId) {
    super(type);
    this.itemId = itemId;
    this.entityId = entityId;
  }
}

const createInstance = () => {
  const instance = getCurrentInstance();
  const $root = instance.proxy.$root;
  const nuxtContext = $root.$nuxt?.context;

  const { makeToast } = useMakeToast();

  const eventTarget = new EventTarget();

  const findEntityItemsBestSetId = async(entityId) => {
    const searchResponse = await nuxtContext.$apis.set.search({
      profile: 'items',
      query: `type:${ENTITY_ITEMS_BEST_SET}`,
      qf: `subject:${entityId}`
    });

    return searchResponse.items?.[0] || null;
  };

  const createEntityItemsBestSet = async(entity) => {
    const title = Object.entries(entity?.prefLabel || {}).reduce((memo, [lang, value]) => {
      memo[lang] = Array.isArray(value) ? value[0] : value;
      return memo;
    }, {});

    const setBody = {
      type: ENTITY_ITEMS_BEST_SET,
      title,
      subject: [entity.id]
    };

    return await nuxtContext.$apis.set.create(setBody);
  };

  const pin = async(itemId, entityId) => {
    // first, retrieve full entity for prefLabel for set title, & toast
    const retrieveResponse = await nuxtContext.$apis.entity.retrieve([entityId]);
    const entity = retrieveResponse[0];
    if (!entity) {
      throw new PinnedItemsError(PinnedItemsError.ENTITY_NOT_FOUND);
    }

    // find the EntityItemsBestSet for the entityId
    let entityBestItemsSetId = await findEntityItemsBestSetId(entityId);
    let entityBestItemsSet;

    if (entityBestItemsSetId) {
      // fetch the full set
      entityBestItemsSet = await nuxtContext.$apis.set.requestSet(entityBestItemsSetId);
    } else {
      // no such set exists: create one
      entityBestItemsSet = await createEntityItemsBestSet(entity);
      entityBestItemsSetId = entityBestItemsSet.id;
    }

    // check if it's already full of pinned items
    if (entityBestItemsSet.pinned >= 24) {
      // TODO: throw an error instead, and let consumer show the modal?
      $root.$bvModal.show(`pinned-limit-modal-${itemId}`);
      return;
    }

    // pin item to set
    await nuxtContext.$apis.set.pinItem(entityBestItemsSetId, itemId);
    const entityPrefLabel = langMapValueForLocale(entity.prefLabel, $root.$i18n.locale).values[0];
    // TODO: emit an event instead, and let consumer make the toast?
    makeToast($root.$i18n.t('entity.notifications.pinned', { entity: entityPrefLabel }));

    eventTarget.dispatchEvent(new ItemPinningEvent('pin', itemId, entityId));
  };

  const unpin = async(itemId, entityId) => {
    // find the EntityItemsBestSet for the entityId
    const entityBestItemsSetId = await findEntityItemsBestSetId(entityId);
    if (!entityBestItemsSetId) {
      throw new PinnedItemsError(PinnedItemsError.ENTITY_ITEMS_BEST_SET_NOT_FOUND);
    }

    await nuxtContext.$apis.set.deleteItems(entityBestItemsSetId, itemId);
    // TODO: emit an event instead, and let consumer make the toast?
    makeToast($root.$i18n.t('entity.notifications.unpinned'));

    eventTarget.dispatchEvent(new ItemPinningEvent('unpin', itemId, entityId));
  };

  const on = (type, listener, options) => {
    eventTarget.addEventListener(type, listener, options);
  };

  const off = (type, listener, options) => {
    eventTarget.removeEventListener(type, listener, options);
  };

  return {
    off,
    on,
    pin,
    unpin
  };
};

export function usePinnedItems() {
  const instance = getCurrentInstance();

  if (!instance.proxy.$root.$pinnedItems) {
    instance.proxy.$root.$pinnedItems = createInstance();
  }

  return instance.proxy.$root.$pinnedItems;
}
