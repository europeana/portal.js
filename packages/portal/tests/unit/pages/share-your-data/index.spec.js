import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import ShareYourDataPage from '@/pages/share-your-data/index';
import sinon from 'sinon';

const localVue = createLocalVue();

const landingPageContentfulResponse = {
  data: {
    data: {
      landingPage: {
        items: [
          {
            identifier: 'share-your-data',
            name: 'Share your data',
            description: 'This is a description',
            headline: 'This is a headline',
            image: {
              url: 'https://www.europeana.eu/example.jpg',
              description: 'image description'
            },
            hasPartCollection: {
              items: []
            }
          }
        ]
      }
    }
  }
};

const landingPage = landingPageContentfulResponse.data.data.landingPage.items[0];

const contentfulQueryStub = (response) => sinon.stub().withArgs('landingPage', sinon.match.object).resolves(response);

const factory = () => shallowMountNuxt(ShareYourDataPage, {
  localVue,
  mocks: {
    $contentful: {
      query: contentfulQueryStub(landingPageContentfulResponse)
    },
    $fetchState: {},
    $i18n: {
      locale: 'en',
      isoLocale: () => 'en-GB',
      t: (key) => key
    },
    $route: {
      query: {}
    },
    $error: sinon.spy(),
    $t: (key) => key
  }
});

describe('pages/share-your-data/index', () => {
  afterEach(sinon.resetHistory);

  describe('fetch', () => {
    it('fetches "Share your data" page content from Contentful', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(wrapper.vm.$contentful.query.calledWith('landingPage', {
        identifier: 'share-your-data',
        locale: 'en-GB',
        preview: false
      })).toBe(true);
    });

    it('handles potentially not having a page in Contentful', async() => {
      const resWithoutPage = { data: {
        data: {
          landingPage: {
            items: [null]
          }
        }
      } };

      const wrapper = factory();
      wrapper.vm.$contentful.query = contentfulQueryStub(resWithoutPage);

      await wrapper.vm.fetch();

      expect(wrapper.vm.$error.calledWith(404)).toBe(true);
    });

    describe('when request fails', () => {
      it('handles it with $error', async() => {
        const wrapper = factory();
        wrapper.vm.$contentful.query = sinon.stub().throws(() => new Error('Internal Server Error'));

        await wrapper.vm.fetch();

        expect(wrapper.vm.$error.called).toBe(true);
      });
    });
  });

  describe('computed', () => {
    describe('pageMeta', () => {
      it('uses the primary image of page for og:image', async() => {
        const wrapper = factory();

        await wrapper.vm.fetch();

        const pageMeta = wrapper.vm.pageMeta;

        expect(pageMeta.ogImage).toBe(landingPage.image.url);
      });
    });
  });
});
