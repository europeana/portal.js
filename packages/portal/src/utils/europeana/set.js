import { EuropeanaDataApi } from '@europeana/apis';

export const addMinimalItemPreviewsToSets = async(sets, europeanaRecordApi) => {
  if (!sets) {
    return sets;
  }

  const itemUris = sets.filter((set) => set.items).map((set) => set.items[0]);

  const minimalItemPreviews = await europeanaRecordApi.find(itemUris, {
    profile: 'minimal',
    rows: itemUris.length
  });

  return sets.map((set) => ({
    ...set,
    items: set.items?.map((uri) => {
      const itemId = uri.replace(EuropeanaDataApi.ITEM_URL_PREFIX, '');
      return minimalItemPreviews?.items?.find((item) => item.id === itemId) || { id: itemId };
    })
  }));
};
