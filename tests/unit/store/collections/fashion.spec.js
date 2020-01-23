import * as store from '../../../../store/collections/fashion';

describe('store/collections/fashion', () => {
  describe('getters', () => {
    describe('apiParams', () => {
      const state = {
        apiParams: {}
      };

      it('includes CREATOR in facet param', () => {
        store.getters.apiParams(state).facet.should.include('CREATOR,');
      });

      it('includes proxy_dc_format.en in facet param', () => {
        store.getters.apiParams(state).facet.should.include('proxy_dc_format.en,');
      });

      it('includes proxy_dcterms_medium.en in facet param', () => {
        store.getters.apiParams(state).facet.should.include('proxy_dcterms_medium.en,');
      });

      it('includes proxy_dc_type.en in facet param', () => {
        store.getters.apiParams(state).facet.should.include('proxy_dc_type.en,');
      });
    });
  });
});
