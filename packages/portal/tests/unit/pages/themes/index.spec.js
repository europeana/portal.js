import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import page from '@/pages/themes/index';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const themesPageContentfulResponse = {
  data: {
    data: {
      themePageCollection: {
        items: [
          {
            identifier: 'theme-name',
            name: 'Theme name',
            description: 'Theme description',
            primaryImageOfPage: {
              image: {
                url: 'image url'
              }
            }
          }
        ]
      }
    }
  }
};

const factory = ({ data = {} } = {}) => shallowMountNuxt(page, {
  localVue,
  data() {
    return data;
  },
  mocks: {
    $contentful: {
      assets: {
        optimisedContentfulImageUrl: sinon.spy((img) => `${img?.url}?optimised`)
      },
      query: sinon.stub().resolves(themesPageContentfulResponse)
    },
    $i18n: {
      locale: 'en',
      localeProperties: { iso: 'en-GB' }
    },
    $route: { query: {} },
    $t: (key) => key,
    $tc: (key) => key,
    localePath: (args) => {
      return args.params ? `${args.params.type}/${args.params.pathMatch}` : args;
    },
    $fetchState: {}
  }
});

describe('theme hub page', () => {
  describe('head()', () => {
    it('uses translated description for og:description', () => {
      const wrapper = factory();

      const headMeta = wrapper.vm.pageMeta;

      expect(headMeta.description).toBe('themes.description');
    });
    it('uses translated title', () => {
      const wrapper = factory();

      const headMeta = wrapper.vm.pageMeta;

      expect(headMeta.title).toBe('themes.themes');
    });
  });

  describe('data', () => {
    it('is loaded from contentful', async() => {
      const wrapper = factory();
      await wrapper.vm.fetch();

      expect(wrapper.vm.$contentful.query.calledWith('themes', {
        locale: 'en-GB',
        preview: false
      })).toBe(true);
    });
  });
});
