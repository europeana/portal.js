import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import ThemePage from '@/pages/themes/_';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const themePageContentfulResponse = {
  data: {
    data: {
      themePage: { items: [{
        identifier: 'art',
        name: 'Art',
        description: 'Description of the Art theme',
        entityUri: 'http://data.europeana.eu/concept/123'
      }] }
    }
  }
};

const contentfulQueryStub = () => {
  const stub = sinon.stub();

  stub.withArgs('themePage', sinon.match.object).resolves(themePageContentfulResponse);

  return stub;
};

const context = {
  app: { i18n: {
    locale: 'en',
    isoLocale: () => 'en-GB'
  },
  $contentful: {
    query: contentfulQueryStub()
  } },
  params: { pathMatch: 'art' },
  query: {},
  error: (e) => e
};

const factory = () => shallowMountNuxt(ThemePage, {
  localVue,
  data() {
    return themePageContentfulResponse.data.data.themePage.items[0];
  },
  mocks: {
    $t: (key) => key,
    $tc: (key) => key
  },
  stubs: ['ContentHeader', 'EntityBadges', 'EntityCardGroup', 'SetCardGroup', 'CallToActionBanner', 'RelatedEditorial', 'ItemPreviewCardGroup', 'SmartLink']
});

describe('pages/themes/_', () => {
  afterEach(sinon.resetHistory);

  describe('asyncData', () => {
    it('fetches theme page content from Contentful', async() => {
      const wrapper = factory();

      await wrapper.vm.asyncData(context);

      expect(context.app.$contentful.query.calledWith('themePage', {
        locale: 'en-GB',
        identifier: 'art',
        preview: false
      })).toBe(true);
    });
  });
});
