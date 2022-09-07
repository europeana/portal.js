import Vue from 'vue';

describe('Vue filters', () => {
  describe('urlWithProtocol', () => {
    const urlWithProtocol = Vue.filter('urlWithProtocol');

    describe('when the URL begins with //', () => {
      it('prepends https:', () => {
        const url = '//example.org/';

        const withProtocol = urlWithProtocol(url);

        expect(withProtocol).toBe('https://example.org/');
      });
    });

    describe('when the URL begins with http:', () => {
      it('is returned as-is', () => {
        const url = 'http://example.org/';

        const withProtocol = urlWithProtocol(url);

        expect(withProtocol).toBe('http://example.org/');
      });
    });
  });
});
