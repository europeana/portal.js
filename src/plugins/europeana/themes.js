// Thematic collections available via the `collection` qf filter.
//
// NOTE: Order is significant as it will be reflected in the collection filter
//       on the search interface.
//
// TODO: remove when thematic collections topics get their own 'theme' type
// TODO: move collection-specific search handling from store/collections/*
//       to here
export default [
  {
    id: '83', qf: 'ww1',
    filters: { api: { default: 'metadata' } }
  },
  { id: '80', qf: 'archaeology' },
  { id: '190', qf: 'art' },
  { id: '55', qf: 'fashion' },
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
