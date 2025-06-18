import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import ThemesPage from '@/pages/themes/index';

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

const contentfulQueryStub = sinon.stub().resolves(themesPageContentfulResponse);

const factory = ({ data = {} } = {}) => shallowMountNuxt(ThemesPage, {
  localVue,
  data() {
    return data;
  },
  mocks: {
    $contentful: {
      query: contentfulQueryStub
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

describe('ThemesPage', () => {
  afterEach(sinon.resetHistory);
  afterAll(sinon.restore);

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

      expect(contentfulQueryStub.calledWith(
        sinon.match((ast) => ast?.definitions?.[0]?.name?.value === 'Themes'),
        {
          locale: 'en-GB',
          preview: false
        }
      )).toBe(true);
    });
  });
});
