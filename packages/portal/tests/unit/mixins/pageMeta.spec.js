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
            }
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
});
