import * as store from '../../../store/apis';

describe('store/apis', () => {
  describe('mutations', () => {
    describe('readUrlsFromRequestHeaders', () => {
      it('sets URLs for APIs from request headers', () => {
        const headers = {
          'x-europeana-annotation-api-url': 'https://annotation.example.org',
          'x-europeana-entity-api-url': 'https://entity.example.org',
          'x-europeana-record-api-url': 'https://record.example.org'
        };
        const state = store.state();

        store.mutations.readUrlsFromRequestHeaders(state, headers);

        state.urls.annotation.should.eql('https://annotation.example.org');
        state.urls.entity.should.eql('https://entity.example.org');
        state.urls.record.should.eql('https://record.example.org');
      });
    });
  });
});
