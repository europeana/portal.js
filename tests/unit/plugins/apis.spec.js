import plugin from '@/plugins/apis';

import sinon from 'sinon';

const inject = sinon.spy();

describe('plugins/apis', () => {
  describe('store module', () => {
    let storeModule;

    beforeAll(async() => {
      await plugin({
        app: {},
        store: {
          registerModule: sinon.spy((name, module) => {
            storeModule = module;
          })
        }
      }, inject);
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

          storeModule.mutations.init(state, { $config: { europeana: { apis: {} } }, req: { headers } });

          expect(state.urls.annotation).toEqual('https://annotation.example.org');
          expect(state.urls.entity).toEqual('https://entity.example.org');
          expect(state.urls.record).toEqual('https://record.example.org');
        });
      });
    });
  });
});
