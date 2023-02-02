// Themes available via the `collection` qf filter.
const themes = [
  { id: 'archaeology' },
  { id: 'art' },
  {
    id: 'fashion',
    facets: [
      { field: 'CREATOR', label: / \(Designer\)/ },
      { field: 'proxy_dc_type.en', label: /Object Type: / },
      { field: 'proxy_dc_format.en', label: /Technique: / },
      { field: 'proxy_dcterms_medium.en', label: /Material: / }
    ]
  },
  { id: 'industrial' },
  { id: 'manuscript' },
  { id: 'map' },
  { id: 'migration' },
  { id: 'music' },
  { id: 'nature' },
  {
    id: 'newspaper',
    filters: { api: { default: 'fulltext' }, date: { field: 'proxy_dcterms_issued' } }
  },
  { id: 'photography' },
  { id: 'sport' },
  {
    id: 'ww1',
    filters: { api: { default: 'metadata' } }
  }
];

export default themes;
