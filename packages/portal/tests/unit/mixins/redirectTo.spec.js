import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../utils';
import sinon from 'sinon';

import mixin from '@/mixins/redirectTo';

const component = {
  template: '<div></div>',
  mixins: [mixin]
};

const localVue = createLocalVue();

const factory = ({ mocks = {} } = {}) => shallowMountNuxt(component, {
  localVue,
  mocks: {
    $config: { app: { search: { translateLocales: 'es' } } },
    $route: {},
    $nuxt: { context: { redirect: sinon.spy(), app: { router: { replace: sinon.spy() } } } },
    ...mocks
  }
});

describe('mixins/redirectTo', () => {
  afterEach(sinon.resetHistory);
  afterAll(() => {
    delete process.client;
    delete process.server;
    sinon.reset();
  });

  describe('redirectToAltRoute', () => {
    const name = 'item-all';
    const $route = { name, params: { pathMatch: '123/abc' }, query: { lang: 'es' } };
    const changes = { params: { pathMatch: '123/def' } };

    describe('server-side', () => {
      beforeAll(() => {
        process.server = true;
        process.client = false;
      });

      it('alters the current route with supplied changes and redirects', async() => {
        const wrapper = factory({ mocks: { $route } });

        wrapper.vm.redirectToAltRoute(changes);

        expect(wrapper.vm.$nuxt.context.redirect.calledWith(302, {
          hash: '',
          name,
          params: changes.params,
          query: $route.query
        })).toBe(true);
      });
    });

    describe('client-side', () => {
      beforeAll(() => {
        process.client = true;
        process.server = false;
      });

      it('alters the current route with supplied changes and redirects', async() => {
        const wrapper = factory({ mocks: { $route } });

        wrapper.vm.redirectToAltRoute(changes);

        expect(wrapper.vm.$nuxt.context.app.router.replace.calledWith({
          hash: '',
          name,
          params: changes.params,
          query: $route.query
        })).toBe(true);
      });
    });
  });

  describe('redirectToPrefPath', () => {
    const name = 'collections-type-all';
    const id = '123';
    const label = 'label';
    const pathMatch = '123-label';

    describe('server-side', () => {
      beforeAll(() => {
        process.server = true;
        process.client = false;
      });

      describe('when the slug already uses the label', () => {
        const $route = { name, params: { pathMatch } };

        it('does not redirect', async() => {
          const wrapper = factory({ mocks: { $route } });

          await (wrapper.vm.redirectToPrefPath(id, label));

          expect(wrapper.vm.$nuxt.context.redirect.called).toBe(false);
        });
      });

      describe('when the URL slug does not use the label', () => {
        const $route = { name, params: { pathMatch: '123-not-the-label' } };

        it('redirects', async() => {
          const wrapper = factory({ mocks: { $route } });

          await (wrapper.vm.redirectToPrefPath(id, label));

          expect(wrapper.vm.$nuxt.context.redirect.calledWith(302, {
            hash: '',
            name,
            params: { pathMatch },
            query: {}
          })).toBe(true);
        });
      });
    });

    describe('client-side', () => {
      beforeAll(() => {
        process.client = true;
        process.server = false;
      });

      describe('when the slug already uses the label', () => {
        const $route = { name, params: { pathMatch } };

        it('does not redirect', async() => {
          const wrapper = factory({ mocks: { $route } });

          await (wrapper.vm.redirectToPrefPath(id, label));

          expect(wrapper.vm.$nuxt.context.app.router.replace.called).toBe(false);
        });
      });

      describe('when the URL slug does not use the label', () => {
        const $route = { name, params: { pathMatch: '123-not-the-label' } };

        it('redirects', async() => {
          const wrapper = factory({ mocks: { $route } });

          await (wrapper.vm.redirectToPrefPath(id, label));

          expect(wrapper.vm.$nuxt.context.app.router.replace.calledWith({
            hash: '',
            name,
            params: { pathMatch },
            query: {}
          })).toBe(true);
        });
      });
    });
  });
});
