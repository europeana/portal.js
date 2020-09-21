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

        state.annotation.url.should.eql('https://annotation.example.org');
        state.entity.url.should.eql('https://entity.example.org');
        state.record.url.should.eql('https://record.example.org');
      });
    });
  });
});
