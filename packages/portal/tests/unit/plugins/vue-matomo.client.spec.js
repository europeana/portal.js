import sinon from 'sinon';
import * as plugin from '@/plugins/vue-matomo.client';

describe('plugins/vue-matomo.client', () => {
  describe('trackSiteSearch', () => {
    describe('when route includes non-empty query', () => {
      const route = { query: { query: 'gothic' }, name: 'search' };

      it('uses query as keyword', () => {
        const keyword = plugin.trackSiteSearch()(route).keyword;

        expect(keyword).toBe('gothic');
      });
    });

    describe('when route includes empty query', () => {
      const route = { query: { query: '' }, name: 'search' };

      it('uses *:* as keyword', () => {
        const keyword = plugin.trackSiteSearch()(route).keyword;

        expect(keyword).toBe('*:*');
      });
    });

    describe('when route is for a collection page', () => {
      const route = { query: { query: 'gothic' }, name: 'collections-type-all___en', params: { type: 'topic', pathMatch: '190-art' } };

      it('uses collection params as category', () => {
        const category = plugin.trackSiteSearch()(route).category;

        expect(category).toBe('topic 190-art');
      });
    });

    describe('when route has a single advanced search on search page', () => {
      const route = { query: { qa: 'proxy_dc_title:The' }, name: 'search' };

      it('returns `*:*`` and the query as a keyword', () => {
        const siteSearch = plugin.trackSiteSearch()(route);

        expect(siteSearch.keyword).toBe('*:* AND proxy_dc_title:The');
      });
    });

    describe('when route has multiple advanced searches on search page', () => {
      const route = { query: { qa: ['proxy_dc_title:The', 'proxy_dc_creator:Von'] }, name: 'search' };

      it('returns `*:*` and both query parts joined via `AND` as a keyword', () => {
        const siteSearch = plugin.trackSiteSearch()(route);

        expect(siteSearch.keyword).toBe('*:* AND proxy_dc_title:The AND proxy_dc_creator:Von');
      });
    });

    describe('when route has a query and an advanced search on search page', () => {
      const route = { query: { query: 'gothic',  qa: 'proxy_dc_title:The' }, name: 'search' };

      it('returns the query and advanced query joined via `AND` as a keyword', () => {
        const siteSearch = plugin.trackSiteSearch()(route);

        expect(siteSearch.keyword).toBe('gothic AND proxy_dc_title:The');
      });
    });

    describe('when route has no query on search page', () => {
      // TODO: is this right?
      const route = { query: {}, name: 'search' };

      it('returns `null`', () => {
        const siteSearch = plugin.trackSiteSearch()(route);

        expect(siteSearch === null).toBe(true);
      });
    });

    describe('when route has no query on collection page', () => {
      // TODO: is this right?
      const route = { query: {}, name: 'collections-type-all___en', params: { type: 'topic', pathMatch: '190-art' }  };

      it('returns `null`', () => {
        const siteSearch = plugin.trackSiteSearch()(route);

        expect(siteSearch === null).toBe(true);
      });
    });

    describe('when route has no query on a non-search page', () => {
      const route = { query: {}, name: 'home' };

      it('returns `null`', () => {
        const siteSearch = plugin.trackSiteSearch()(route);

        expect(siteSearch === null).toBe(true);
      });
    });

    describe('when store state has search totalResults', () => {
      const store = { state: { search: { totalResults: 9890 } } };
      const route = { query: { query: 'gothic' }, name: 'search' };

      it('uses totalResults for resultsCount', () => {
        const resultsCount = plugin.trackSiteSearch(store)(route).resultsCount;

        expect(resultsCount).toBe(9890);
      });
    });
  });

  describe('waitForMatomo', () => {
    const context = { app: {}, $config: { matomo: { host: 'stats.example.org', siteId: 1 } } };

    it('is injected into context', () => {
      const inject = sinon.spy();

      plugin.default(context, inject);

      expect(inject.calledWith('waitForMatomo', sinon.match.func)).toBe(true);
    });

    describe('promise', () => {
      let waitForMatomo;
      const inject = (name, fn) => waitForMatomo = fn;

      it('resolves if $matomo already set', async() => {
        plugin.default(context, inject);
        const vm = {
          $matomo: true,
          waitForMatomo
        };

        const promise = vm.waitForMatomo();

        await expect(promise).resolves.not.toThrow();
      });

      it('resolves if $matomo set later', async() => {
        const quickFailContext = { ...context, $config: { matomo: { ...context.$config.matomo, loadWait: { delay: 10, retries: 10 } } } };
        plugin.default(quickFailContext, inject);
        const vm = {
          waitForMatomo
        };

        const promise = vm.waitForMatomo();
        setTimeout(() => vm.$matomo = true, 5);

        await expect(promise).resolves.not.toThrow();
      });

      it('rejects if $matomo never set', async() => {
        const instantFailContext = { ...context, $config: { matomo: { ...context.$config.matomo, loadWait: { delay: 0, retries: 1 } } } };
        plugin.default(instantFailContext, inject);
        const vm = {
          waitForMatomo
        };

        const promise = vm.waitForMatomo();

        await expect(promise).rejects.toEqual(Error('No Matomo'));
      });
    });
  });
});
