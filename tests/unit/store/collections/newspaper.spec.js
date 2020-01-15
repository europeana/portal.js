import * as store from '../../../../store/collections/newspaper';

describe('store/collections/newspaper', () => {
  describe('getters', () => {
    describe('apiOptions', () => {
      context('when api param is "fulltext"', () => {
        const getters = {
          apiParams: {
            api: 'fulltext'
          }
        };

        it('sets origin option to Newpapers API', () => {
          store.getters.apiOptions({}, getters).origin.should.eq('https://newspapers.eanadev.org');
        });
      });

      context('when api param is "metadata"', () => {
        const getters = {
          apiParams: {
            api: 'metadata'
          }
        };

        it('does not set origin option to Newpapers API', () => {
          (store.getters.apiOptions({}, getters).origin === undefined).should.be.true;
        });
      });
    });

    describe('apiParams', () => {
      context('when api param is absent', () => {
        const state = {
          apiParams: {}
        };

        it('defaults api param to "fulltext"', () => {
          store.getters.apiParams(state).api.should.eq('fulltext');
        });
      });

      context('when api param is "fulltext"', () => {
        const state = {
          apiParams: {
            api: 'fulltext',
            qf: ['contentTier:(1 OR 2 OR 3 OR 4)']
          }
        };

        it('overrides contentTier filter to "*"', () => {
          store.getters.apiParams(state).qf.should.deep.eql(['contentTier:*']);
        });
      });
    });
  });
});
