// Thematic collections available via the `collection` qf filter.
//
// NOTE: Order is significant as it will be reflected in the collection filter
//       on the search interface.
export const themes = [
  {
    id: '83', qf: 'ww1',
    filters: { api: { default: 'metadata' } }
  },
  { id: '80', qf: 'archaeology' },
  { id: '190', qf: 'art' },
  {
    id: '55', qf: 'fashion',
    facets: [
      { field: 'CREATOR', label: / \(Designer\)/ },
      { field: 'proxy_dc_type.en', label: /Object Type: / },
      { field: 'proxy_dc_format.en', label: /Technique: / },
      { field: 'proxy_dcterms_medium.en', label: /Material: / }
    ]
  },
  { id: '129', qf: 'industrial' },
  { id: '17', qf: 'manuscript' },
  { id: '151', qf: 'map' },
  { id: '128', qf: 'migration' },
  { id: '62', qf: 'music' },
  { id: '156', qf: 'nature' },
  {
    id: '18', qf: 'newspaper',
    filters: { api: { default: 'fulltext' }, date: { field: 'proxy_dcterms_issued' } }
  },
  { id: '48', qf: 'photography' },
  { id: '114', qf: 'sport' }
];

export const themeOverrides = async({ $store, $i18n, $route, $contentful }, themes) => {
  let curatedEntities = $store.state.entity.curatedEntities;
  if (!curatedEntities) {
    const contentfulVariables = {
      locale: $i18n.isoLocale(),
      preview: $route.query.mode === 'preview'
    };
    const contentfulResponse = await $contentful.query('curatedEntities', contentfulVariables);
    curatedEntities = contentfulResponse.data.data.curatedEntities.items;
    $store.commit('entity/setCuratedEntities', curatedEntities);
  }
  return themes.map(theme => {
    const contentfulData = curatedEntities.find((curatedEntity) => curatedEntity.identifier === theme.id) || {};
    const override = {};
    if (contentfulData.identifier) {
      override.id = contentfulData.identifier;
    }
    if (contentfulData.name) {
      override.prefLabel = { [$i18n.locale]: contentfulData.name };
    }
    if (contentfulData.primaryImageOfPage?.image) {
      override.contentfulImage = contentfulData.primaryImageOfPage.image;
    }

    return  { ...theme, ...override };
  });
};
