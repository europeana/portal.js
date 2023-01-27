// Thematic collections available via the `collection` qf filter.
const themes = [
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

export default themes;
