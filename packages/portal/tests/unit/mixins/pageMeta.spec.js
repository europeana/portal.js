import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../utils';

import mixin from '@/mixins/pageMeta';

const localVue = createLocalVue();

const factory = ({ computed = {}, mocks = {} } = {}) => {
  const component = {
    template: '<div></div>',
    computed,
    mixins: [mixin]
  };

  const wrapper = shallowMountNuxt(component, {
    localVue,
    mocks: {
      $config: { app: { siteName: 'Europeana' } },
      $fetchState: {},
      $t: (key) => key,
      ...mocks
    }
  });
  wrapper.vm.head = mixin.head;
  return wrapper;
};

describe('mixins/pageMeta', () => {
  describe('head', () => {
    describe('title', () => {
      it('combines page title and site name', () => {
        const computed = {
          pageMeta() {
            return {
              title: 'Home'
            };
          }
        };

        const wrapper = factory({ computed });

        expect(wrapper.vm.head().title).toBe('Home | Europeana');
      });
    });

    describe('meta', () => {
      it('includes meta tags for pageMeta computed property', () => {
        const pageMeta = {
          title: 'Home',
          description: 'Europeana',
          ogImage: 'https://www.example.org/image.jpeg',
          ogImageAlt: '',
          ogType: 'website'
        };
        const computed = {
          pageMeta() {
            return pageMeta;
          }
        };
        const wrapper = factory({ computed });

        const headMeta = wrapper.vm.head().meta;

        expect(headMeta.find((tag) => tag.name === 'title').content).toBe(pageMeta.title);
        expect(headMeta.find((tag) => tag.property === 'og:title').content).toBe(pageMeta.title);
        expect(headMeta.find((tag) => tag.name === 'description').content).toBe(pageMeta.description);
        expect(headMeta.find((tag) => tag.property === 'og:description').content).toBe(pageMeta.description);
        expect(headMeta.find((tag) => tag.property === 'og:type').content).toBe(pageMeta.ogType);
        expect(headMeta.find((tag) => tag.property === 'og:image').content).toBe(pageMeta.ogImage);
        expect(headMeta.find((tag) => tag.property === 'og:image:alt').content).toBe(pageMeta.ogImageAlt);
      });
    });
  });

  describe('computed', () => {
    describe('pageTitle', () => {
      const computed = {
        pageMeta() {
          return {
            title: 'Home'
          };
        }
      };

      describe('when fetchState has error', () => {
        describe('and error has code', () => {
          const mocks = { $fetchState: { error: { code: 'item-not-found' } } };

          it('uses translated meta title from code', () => {
            const wrapper = factory({ mocks, computed });

            const pageTitle = wrapper.vm.pageTitle;

            expect(pageTitle).toBe('errorMessage.item-not-found.metaTitle');
          });
        });

        describe('but error has no code', () => {
          const mocks = { $fetchState: { error: { statusCode: 500 } } };

          it('uses translated "error"', () => {
            const wrapper = factory({ mocks, computed });

            const pageTitle = wrapper.vm.pageTitle;

            expect(pageTitle).toBe('error');
          });
        });
      });

      describe('when fetchState has no error', () => {
        const mocks = { $fetchState: {} };

        it('uses pageMeta title', () => {
          const wrapper = factory({ mocks, computed });

          const pageTitle = wrapper.vm.pageTitle;

          expect(pageTitle).toBe('Home');
        });
      });
    });
  });
});
