import * as store from '../../../../store/collections/newspaper';

const apiConfig = {
  newspaper: {
    origin: 'https://newspapers.eanadev.org'
  }
};

describe('store/collections/newspaper', () => {
  describe('getters', () => {
    describe('apiOptions', () => {
      context('when api param is "fulltext"', () => {
        const getters = {
          apiParams: {
            api: 'fulltext'
          },
          apiConfig
        };

        it('sets origin option to Newpapers API', () => {
          store.getters.apiOptions({}, getters).origin.should.eq('https://newspapers.eanadev.org');
        });
      });

      context('when api param is "metadata"', () => {
        const getters = {
          apiParams: {
            api: 'metadata'
          },
          apiConfig
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
        const getters = {
          apiConfig
        };

        it('defaults api param to "fulltext"', () => {
          store.getters.apiParams(state, getters).api.should.eq('fulltext');
        });
      });

      context('when api param is "fulltext"', () => {
        const state = {
          apiParams: {
            api: 'fulltext',
            qf: ['contentTier:(1 OR 2 OR 3 OR 4)']
          }
        };
        const getters = {
          apiConfig
        };

        it('overrides contentTier filter to "*"', () => {
          store.getters.apiParams(state, getters).qf.should.deep.eql(['contentTier:*']);
        });
      });
    });
  });
});
