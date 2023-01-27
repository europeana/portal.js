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

const contentfulQueryStub = (response) => sinon.stub().withArgs('themePage', sinon.match.object).resolves(response);

const factory = () => shallowMountNuxt(ThemePage, {
  localVue,
  mocks: {
    $contentful: {
      query: contentfulQueryStub(themePageContentfulResponse)
    },
    $fetchState: {},
    $i18n: {
      locale: 'en',
      isoLocale: () => 'en-GB',
      t: (key) => key
    },
    $nuxt: { context: { res: {} } },
    $route: {
      params: { pathMatch: 'art' },
      query: {}
    },
    $t: (key) => key,
    $tc: (key) => key
  },
  stubs: ['ContentHeader', 'EntityBadges', 'EntityCardGroup', 'SetCardGroup', 'CallToActionBanner', 'RelatedEditorial', 'ItemPreviewCardGroup', 'SmartLink']
});

describe('pages/themes/_', () => {
  afterEach(sinon.resetHistory);

  describe('fetch', () => {
    it('fetches theme page content from Contentful', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(wrapper.vm.$contentful.query.calledWith('themePage', {
        locale: 'en-GB',
        identifier: 'art',
        preview: false
      })).toBe(true);
    });
    describe('when there is no theme identifier found', () => {
      it('throws a 404 error', async() => {
        process.server = true;
        const resWithoutIdentifier = { ...themePageContentfulResponse };
        resWithoutIdentifier.data.data.themePage.items[0].identifier = null;

        const wrapper = factory();
        wrapper.vm.$contentful.query = contentfulQueryStub(resWithoutIdentifier);

        let error;
        try {
          await wrapper.vm.fetch();
        } catch (e) {
          error = e;
        }

        expect(error.message).toBe('messages.notFound');
        expect(wrapper.vm.$nuxt.context.res.statusCode).toBe(404);
      });
    });
    describe('when there is no theme found', () => {
      it('throws a 404 error', async() => {
        const resWithoutPage = { ...themePageContentfulResponse };
        resWithoutPage.data.data.themePage.items[0] = null;
        const wrapper = factory();
        wrapper.vm.$contentful.query = contentfulQueryStub(resWithoutPage);

        let error;
        try {
          await wrapper.vm.fetch();
        } catch (e) {
          error = e;
        }

        expect(error.message).toBe('messages.notFound');
        expect(wrapper.vm.$nuxt.context.res.statusCode).toBe(404);
      });
    });
    describe('when request fails', () => {
      it('set the status code on SSRs', async() => {
        const wrapper = factory();
        wrapper.vm.$contentful.query = sinon.stub().throws(() => new Error('Internal Server Error'));

        let error;
        try {
          await wrapper.vm.fetch();
        } catch (e) {
          error = e;
        }

        expect(wrapper.vm.$nuxt.context.res.statusCode).toBe(500);
        expect(error.message).toBe('Internal Server Error');
      });
    });
  });
});
