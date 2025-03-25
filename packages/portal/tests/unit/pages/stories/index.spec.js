import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import StoriesPage from '@/pages/stories/index';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const storiesPageContentfulResponse = {
  data: {
    data: {
      storiesPageCollection: {
        items: [
          {
            image: {
              url: 'https://www.europeana.eu/example.jpg',
              description: 'image description'
            },
            primaryCallToAction: { name: 'PrimaryCTA', relatedLink: {}, text: '' }
          }
        ]
      }
    }
  }
};

const contentfulQueryStub = () => {
  const stub = sinon.stub();
  stub.withArgs('storiesPage', sinon.match.object).resolves(storiesPageContentfulResponse);
  return stub;
};

const factory = ({ $fetchState = {}, mocks = {} } = {}) => shallowMountNuxt(StoriesPage, {
  localVue,
  mocks: {
    $contentful: {
      query: contentfulQueryStub()
    },
    $fetchState,
    $i18n: {
      locale: 'en',
      localeProperties: { iso: 'en-GB' }
    },
    $route: { query: {} },
    $scrollTo: sinon.spy(),
    $t: (key) => key,
    $tc: (key) => key,
    ...mocks
  },
  stubs: [
    'AlertMessage',
    'b-card-group'
  ]
});

describe('pages/stories/index', () => {
  afterEach(sinon.resetHistory);

  describe('fetch', () => {
    it('fetches stories page content from Contentful', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(wrapper.vm.$contentful.query.calledWith('storiesPage', {
        locale: 'en-GB',
        preview: false
      })).toBe(true);
    });

    it('handles potentially not having a page in Contentful', async() => {
      const contentfulQueryStubNoStoriesPage = contentfulQueryStub();
      contentfulQueryStubNoStoriesPage
        .withArgs('storiesPage', sinon.match.object)
        .resolves({ data: { data: { storiesPageCollection: { items: [] } } } });

      const wrapper = factory({ mocks: { $contentful: { query: contentfulQueryStubNoStoriesPage } } });
      await wrapper.vm.fetch();

      expect(wrapper.vm.headline).toEqual(null);
    });

    describe('when fetch errors', () => {
      it('renders an alert message', () => {
        const wrapper = factory({ $fetchState: { error: { message: 'Error message' } } });

        const alertMessage = wrapper.find('[data-qa="alert message container"]');

        expect(alertMessage.exists()).toBe(true);
      });
    });
  });

  describe('computed', () => {
    describe('pageMeta', () => {
      it('uses localised page title for title meta field', () => {
        const wrapper = factory();

        const pageMeta = wrapper.vm.pageMeta;

        expect(pageMeta.title).toBe('stories.stories');
      });
    });
  });
});
