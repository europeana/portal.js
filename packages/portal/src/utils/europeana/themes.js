// Themes available via the `collection` qf filter.
const themes = [
  { id: 'archaeology', qf: 'archaeology' },
  { id: 'art', qf: 'art' },
  {
    id: 'fashion',
    qf: 'fashion',
    facets: [
      { field: 'CREATOR', label: / \(Designer\)/ },
      { field: 'proxy_dc_type.en', label: /Object Type: / },
      { field: 'proxy_dc_format.en', label: /Technique: / },
      { field: 'proxy_dcterms_medium.en', label: /Material: / }
    ]
  },
  { id: 'industrial-heritage', qf: 'industrial' },
  { id: 'manuscripts', qf: 'manuscript' },
  { id: 'maps-and-geography', qf: 'map' },
  { id: 'migration', qf: 'migration' },
  { id: 'music', qf: 'music' },
  { id: 'natural-history', qf: 'nature' },
  {
    id: 'newspapers',
    qf: 'newspaper',
    filters: { date: { field: 'proxy_dcterms_issued' }, sort: { field: 'proxy_dcterms_issued' } }
  },
  { id: 'photography', qf: 'photography' },
  { id: 'sport', qf: 'sport' },
  {
    id: 'world-war-i',
    qf: 'ww1'
  }
];

export default themes;
