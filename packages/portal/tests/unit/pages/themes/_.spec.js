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

const contentfulQueryStub = sinon.stub().withArgs('themePage', sinon.match.object).resolves(themePageContentfulResponse);

const context = {
  app: { i18n: {
    locale: 'en',
    isoLocale: () => 'en-GB',
    t: (key) => key
  },
  $contentful: {
    query: contentfulQueryStub
  } },
  params: { pathMatch: 'art' },
  query: {},
  error: sinon.stub()
};

const factory = () => shallowMountNuxt(ThemePage, {
  localVue,
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
    describe('when there is no theme identifier found', () => {
      it('throws a 404 error', async() => {
        const wrapper = factory();
        themePageContentfulResponse.data.data.themePage.items[0].identifier = null;

        await wrapper.vm.asyncData(context);

        expect(context.error.calledWith({ statusCode: 404, message: ('messages.notFound') })).toBe(true);
      });
    });
    describe('when there is no theme found', () => {
      it('throws a 404 error', async() => {
        const wrapper = factory();
        themePageContentfulResponse.data.data.themePage.items[0] = null;

        await wrapper.vm.asyncData(context);

        expect(context.error.calledWith({ statusCode: 404, message: ('messages.notFound') })).toBe(true);
      });
    });
  });
});
