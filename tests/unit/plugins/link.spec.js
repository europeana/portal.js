import linkPluginModule from '../../../plugins/link';

let linkPlugin;
linkPluginModule(
  {},
  (name, plugin) => linkPlugin = plugin
);

describe('link plugin', () => {
  describe('to()', () => {
    it('returns null for string including "://"', () => {
      const route = 'http://example.org/about';

      const to = linkPlugin.to(route);

      (to === null).should.be.true;
    });

    it('returns route for object', () => {
      const route = {
        path: '/about'
      };

      const to = linkPlugin.to(route);

      to.should.eql(route);
    });

    it('returns route for string without "://"', () => {
      const route = '/about';

      const to = linkPlugin.to(route);

      to.should.eql(route);
    });
  });

  describe('href()', () => {
    it('returns route for string including "://"', () => {
      const route = 'http://example.org/about';

      const href = linkPlugin.href(route);

      href.should.eql(route);
    });

    it('returns null for object', () => {
      const route = {
        path: '/about'
      };

      const href = linkPlugin.href(route);

      (href === null).should.be.true;
    });

    it('returns null for string without "://"', () => {
      const route = '/about';

      const href = linkPlugin.href(route);

      (href === null).should.be.true;
    });
  });
});
