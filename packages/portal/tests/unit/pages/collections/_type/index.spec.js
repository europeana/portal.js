import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../../utils';
import BootstrapVue from 'bootstrap-vue';

import collectionType from '@/pages/collections/_type/index';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (options = {}) => shallowMountNuxt(collectionType, {
  localVue,
  mocks: {
    $fetchState: options.fetchState || {},
    $t: (key, args) => args ? `${key} ${args}` : key,
    $route: { params: { type: options.type } },
    $pageHeadTitle: key => key,
    $nuxt: { context: { res: {} } }
  },
  stubs: {
    EntityTable: true,
    ErrorMessage: true
  }
});

describe('pages/collections/_type/index', () => {
  describe('fetch', () => {
    it('detects no valid collection type and throws 404', async() => {
      process.server = true;
      const wrapper = factory({ type: 'not-found' });

      let error;
      try {
        await wrapper.vm.fetch();
      } catch (e) {
        error = e;
      }

      expect(error.message).toBe('Unknown collection type');
      expect(wrapper.vm.$nuxt.context.res.statusCode).toBe(404);
    });
  });

  describe('computed', () => {
    describe('pageTitle', () => {
      it('is based on the route', () => {
        const wrapper = factory({ type: 'topics' });

        const title = wrapper.vm.pageTitle;

        expect(title).toEqual('pages.collections.topics.title');
      });
      describe('when fetchState has error', () => {
        it('uses translation of "Error"', () => {
          const wrapper = factory({ fetchState: { error: true }, type: 'topics' });

          const title = wrapper.vm.pageTitle;

          expect(title).toBe('error');
        });
        describe('when custom meta title is available', () => {
          it('uses custom meta title', async() => {
            const wrapper = factory({ fetchState: { error: true }, type: 'not-found' });

            try {
              await wrapper.vm.fetch();
            } catch (e) {
              wrapper.vm.$fetchState.error = e;
            }
            const title = wrapper.vm.pageTitle;

            expect(title).toBe('errorMessage.pageNotFound.metaTitle');
          });
        });
      });
    });
  });

  describe('the head title', () => {
    it('uses entity type title', () => {
      const wrapper = factory({ type: 'topics' });

      const headTitle = wrapper.vm.head().title;

      expect(headTitle).toBe('pages.collections.topics.title');
    });
  });
});
