import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import ThemePage from '@/pages/themes/_';
import * as useContentfulGraphqlModule from '@/composables/contentful/useContentfulGraphql.js';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const contentfulQueryStub = sinon.stub();

const themePageContentfulResponse = () => ({
  data: {
    data: {
      themePage: { items: [{
        identifier: 'art',
        name: 'Art',
        description: 'Description of the Art theme',
        entityUri: 'http://data.europeana.eu/concept/123',
        primaryImageOfPage: {
          image: {
            url: 'http://thumbnail.europeana.eu/art'
          }
        },
        hasPartCollection: {
          items: [
            { '__typename': 'TopicGroup' },
            { '__typename': 'Personroup' },
            { '__typename': 'GalleryGroup' },
            { '__typename': 'PrimaryCallToAction' },
            { '__typename': 'CardGroup',
              hasPartCollection: {
                items: [{
                  encoding: {}
                }]
              } }
          ]
        }
      }] }
    }
  }
});

const factory = ({ contentfulResponse = themePageContentfulResponse(), data = {} } = {}) => {
  contentfulQueryStub.withArgs(
    sinon.match((ast) => ast?.definitions?.[0]?.name?.value === 'ThemePage'),
    sinon.match.object
  ).resolves(contentfulResponse);

  return shallowMountNuxt(ThemePage, {
    localVue,
    data() {
      return {
        ...data
      };
    },
    mocks: {
      $fetchState: {},
      $i18n: {
        locale: 'en',
        localeProperties: { iso: 'en-GB' },
        t: (key) => key
      },
      $error: sinon.spy(),
      $route: {
        params: { pathMatch: 'art' },
        query: {}
      },
      $t: (key) => key,
      $tc: (key) => key
    },
    stubs: [
      'CallToActionBanner',
      'ContentHeader',
      'EntityBadges',
      'EntityCardGroup',
      'ErrorMessage',
      'ItemPreviewCardGroup',
      'RelatedEditorial',
      'SetCardGroup',
      'SmartLink'
    ]
  });
};

describe('pages/themes/_', () => {
  beforeAll(() => {
    sinon.stub(useContentfulGraphqlModule, 'useContentfulGraphql').returns({
      query: contentfulQueryStub
    });
  });
  afterEach(sinon.resetHistory);
  afterAll(sinon.restore);

  describe('fetch', () => {
    it('fetches theme page content from Contentful', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(contentfulQueryStub.calledWith(sinon.match((ast) => ast?.definitions?.[0]?.name?.value === 'ThemePage'), {
        locale: 'en-GB',
        identifier: 'art',
        preview: false
      })).toBe(true);
    });

    describe('when there is no theme identifier found', () => {
      it('throws a 404 error via $error', async() => {
        const contentfulResponse = themePageContentfulResponse();
        contentfulResponse.data.data.themePage.items[0].identifier = null;
        const wrapper = factory({ contentfulResponse });

        await wrapper.vm.fetch();

        expect(wrapper.vm.$error.calledWith(404)).toBe(true);
      });
    });

    describe('when there is no theme found', () => {
      it('throws a 404 error via $error', async() => {
        const contentfulResponse = themePageContentfulResponse();
        contentfulResponse.data.data.themePage.items[0] = null;
        const wrapper = factory({ contentfulResponse });

        await wrapper.vm.fetch();

        expect(wrapper.vm.$error.calledWith(404)).toBe(true);
      });
    });
  });

  describe('pageMeta', () => {
    it('uses the primary image of page for og:image', () => {
      const data = themePageContentfulResponse().data.data.themePage.items[0];
      const wrapper = factory({ data });

      const pageMeta = wrapper.vm.pageMeta;

      expect(pageMeta.ogImage).toBe(data.primaryImageOfPage.image);
    });
  });
});
