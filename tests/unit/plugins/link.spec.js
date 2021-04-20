import linkPluginModule from '../../../src/plugins/link';

let linkPlugin;
linkPluginModule(
  {},
  (name, plugin) => linkPlugin = plugin
);

describe('link plugin', () => {
  describe('to()', () => {
    it('returns null for path including "://"', () => {
      const path = 'http://example.org/about';
      const query = { query: 'art' };

      const to = linkPlugin.to(path, query);

      (to === null).should.be.true;
    });

    it('returns route object for path without "://"', () => {
      const path = '/about';
      const query = { query: 'art' };

      const to = linkPlugin.to(path, query);

      to.should.eql({
        path,
        query
      });
    });
  });

  describe('href()', () => {
    it('returns URL for path including "://"', () => {
      const path = 'http://example.org/about';
      const query = { query: 'art' };

      const href = linkPlugin.href(path, query);

      href.should.eql('http://example.org/about?query=art');
    });

    it('returns null for path without "://"', () => {
      const path = '/about';
      const query = { query: 'art' };

      const href = linkPlugin.href(path, query);

      (href === null).should.be.true;
    });
  });
});
