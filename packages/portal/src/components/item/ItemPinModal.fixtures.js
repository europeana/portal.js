const fullPins = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'];

export const ENTITY_URI = 'http://data.europeana.eu/agent/123';

export const fixtures = {
  itemAlreadyPinned: {
    propsData: { identifier: '/123/abc' },
    data: () => ({
      entities: [{ id: ENTITY_URI }],
      selected: ENTITY_URI,
      sets: {
        [ENTITY_URI]: { id: '456', pinned: ['/123/abc'] }
      }
    })
  },
  itemNotPinned: {
    propsData: { identifier: '/123/abc' },
    data: () => ({
      entities: [{ id: ENTITY_URI }],
      selected: ENTITY_URI,
      sets: {
        [ENTITY_URI]: { id: '456', pinned: [] }
      }
    })
  },
  itemAlreadyPinnedInFullSet: {
    propsData: { identifier: fullPins[0] },
    data: () => ({
      entities: [{ id: ENTITY_URI }],
      selected: ENTITY_URI,
      sets: {
        [ENTITY_URI]: { id: '456', pinned: fullPins }
      }
    })
  },
  itemNotPinnedInFullSet: {
    propsData: { identifier: '/123/abc' },
    data: () => ({
      entities: [{ id: ENTITY_URI }],
      selected: ENTITY_URI,
      sets: {
        [ENTITY_URI]: { id: '456', pinned: fullPins }
      }
    })
  },
  setDoesNotExist: {
    propsData: { identifier: '/123/abc' },
    data: () => ({
      entities: [{ id: ENTITY_URI }],
      selected: ENTITY_URI,
      sets: {
        [ENTITY_URI]: { id: null, pinned: [] }
      }
    })
  }
};
