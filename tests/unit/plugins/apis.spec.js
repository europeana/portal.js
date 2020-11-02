import plugin from '../../../plugins/apis';

import sinon from 'sinon';

describe('plugins/apis', () => {
  describe('store module', () => {
    let storeModule;

    before(async() => {
      await plugin({
        app: {},
        store: {
          registerModule: sinon.spy((name, module) => {
            storeModule = module;
          })
        }
      });
    });

    describe('mutations', () => {
      describe('readUrlsFromRequestHeaders', () => {
        it('sets URLs for APIs from request headers', () => {
          const headers = {
            'x-europeana-annotation-api-url': 'https://annotation.example.org',
            'x-europeana-entity-api-url': 'https://entity.example.org',
            'x-europeana-record-api-url': 'https://record.example.org'
          };
          const state = storeModule.state();

          storeModule.mutations.init(state, { req: { headers } });

          state.annotation.baseURL.should.eql('https://annotation.example.org');
          state.entity.baseURL.should.eql('https://entity.example.org');
          state.record.baseURL.should.eql('https://record.example.org');
        });
      });
    });
  });
});
