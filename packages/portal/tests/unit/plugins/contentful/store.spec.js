import store from '@/plugins/contentful/store.js';

describe('@/plugins/contentful/store.js', () => {
  it('is namespaced', () => {
    expect(store.namespaced).toBe(true);
  });

  describe('state', () => {
    describe('acceptedMediaTypes', () => {
      it('defaults to []', () => {
        expect(store.state().acceptedMediaTypes).toEqual([]);
      });
    });
  });

  describe('mutations', () => {
    describe('setAcceptedMediaTypes', () => {
      it('parses media types from HTTP request Accept header', () => {
        const state = {};
        const req = {
          headers: {
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
          }
        };

        store.mutations.setAcceptedMediaTypes(state, req);

        expect(state.acceptedMediaTypes).toEqual(['text/html', 'application/xhtml+xml', 'application/xml', 'image/avif', 'image/webp', 'image/apng', 'application/signed-exchange']);
      });
    });
  });
});
