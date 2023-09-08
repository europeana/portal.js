import * as plugin from '@/plugins/apis';

describe('plugins/apis', () => {
  describe('store module', () => {
    describe('mutations', () => {
      describe('init', () => {
        it('sets URLs for APIs from request headers', () => {
          const storeState = plugin.storeModule.state();
          const headers = {
            'x-europeana-annotation-api-url': 'https://annotation.example.org',
            'x-europeana-entity-management-api-url': 'https://entity-mgmt.example.org',
            'x-europeana-record-api-url': 'https://record.example.org'
          };

          plugin.storeModule.mutations.init(storeState, { $config: { europeana: { apis: {} } }, req: { headers } });

          expect(storeState.urls.annotation).toEqual('https://annotation.example.org');
          expect(storeState.urls.entityManagement).toEqual('https://entity-mgmt.example.org');
          expect(storeState.urls.record).toEqual('https://record.example.org');
        });
      });
    });
  });
});
