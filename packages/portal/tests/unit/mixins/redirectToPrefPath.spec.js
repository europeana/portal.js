import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../utils';
import sinon from 'sinon';

import mixin from '@/mixins/redirectToPrefPath';

const component = {
  template: '<div></div>',
  mixins: [mixin]
};

const localVue = createLocalVue();

const factory = (options) => shallowMountNuxt(component, {
  localVue,
  mocks: {
    $route: { params: { type: options.type, pathMatch: options.pathMatch } },
    $nuxt: { context: { redirect: sinon.spy(), app: { router: { replace: sinon.spy() } } } },
    localePath: () => '/'
  }
});

describe('mixins/redirectToPrefPath', () => {
  describe('redirectToPrefPath', () => {
    const redirectIssued = async({ page, id, label, params, pathMatch, serverOrClient = 'server' }) => {
      if (serverOrClient === 'server') {
        process.server = true;
        process.client = false;
      } else {
        process.server = false;
        process.client = true;
      }

      const wrapper = factory({ ...params, pathMatch });
      wrapper.vm.$route.params.pathMatch = pathMatch;

      await wrapper.vm.redirectToPrefPath(page, id, label, params);

      if (process.server) {
        return wrapper.vm.$nuxt.context.redirect.calledWith(302, '/');
      } else {
        return wrapper.vm.$nuxt.context.app.router.replace.calledWith('/');
      }
    };

    const id = '123';
    const label = 'label';
    for (const serverOrClient of ['server', 'client']) {
      const redirectOrReplace = serverOrClient === 'server' ? 'redirect' : 'replace';

      describe(`${serverOrClient}-side`, () => {
        describe('for a gallery page', () => {
          const page = 'galleries-all';
          const params = {};

          describe('when the slug already uses the name', () => {
            const pathMatch = '123-label';
            it(`does not ${redirectOrReplace}`, async() => {
              expect(await redirectIssued({ page, id, label, params, pathMatch, serverOrClient })).toBe(false);
            });
          });

          describe('when the URL slug does not use the name', () => {
            const pathMatch = '123-not-the-label';
            it(`${redirectOrReplace}s`, async() => {
              expect(await redirectIssued({ page, id, label, params, pathMatch, serverOrClient })).toBe(true);
            });
          });
        });

        describe('for an entity page', () => {
          const page = 'collections-type-all';
          const params = { type: 'topic' };

          describe('when the slug already uses the name', () => {
            const pathMatch = '123-label';
            it(`does not ${redirectOrReplace}`, async() => {
              expect(await redirectIssued({ page, id, label, params, pathMatch, serverOrClient })).toBe(false);
            });
          });

          describe('when the URL slug does not use the name', () => {
            const pathMatch = '123-not-the-label';
            it(`${redirectOrReplace}s`, async() => {
              expect(await redirectIssued({ page, id, label, params, pathMatch, serverOrClient })).toBe(true);
            });
          });
        });
      });
    }
  });
});
