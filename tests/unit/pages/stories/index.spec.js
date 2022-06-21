import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import StoriesPage from '@/pages/stories/index';
import sinon from 'sinon';

const localVue = createLocalVue();

const storiesPageContentfulResponse = {
  data: {
    data: {
      blogPostingCollection: {
        items: [
          { datePublished: '2022-02-12T08:00:00.000+01:00' }
        ]
      },
      exhibitionPageCollection: {
        items: [
          { datePublished: '2022-03-12T08:00:00.000+01:00' },
          { datePublished: '2022-01-12T08:00:00.000+01:00' }
        ]
      }
    }
  }
};

const factory = ({ $features = {}, data = {} } = {}) => shallowMountNuxt(StoriesPage, {
  localVue,
  data() {
    return data;
  },
  mocks: {
    $contentful: {
      query: sinon.stub().resolves(storiesPageContentfulResponse)
    },
    $features: {
      newStoriesPage: true,
      ...$features
    },
    $fetchState: {},
    $i18n: {
      locale: 'en',
      isoLocale: () => 'en-GB'
    },
    $pageHeadTitle: (text) => text,
    $route: { query: {} },
    $t: (key) => key,
    $tc: (key) => key
  },
  stubs: ['IndexPage', 'b-card-group']
});

describe('pages/stories/index', () => {
  afterEach(sinon.resetHistory);

  describe('fetch', () => {
    describe('when new stories page is enabled', () => {
      it('fetches stories content from Contentful', async() => {
        const wrapper = factory();

        await wrapper.vm.fetch();

        expect(wrapper.vm.$contentful.query.calledWith('storiesPage', {
          locale: 'en-GB',
          preview: false
        })).toBe(true);
      });

      it('stores a page of the stories content, ordered by datePublished', async() => {
        const wrapper = factory({ data: { perPage: 2 } });
        const expected = [
          storiesPageContentfulResponse.data.data.exhibitionPageCollection.items[0],
          storiesPageContentfulResponse.data.data.blogPostingCollection.items[0]
        ];

        await wrapper.vm.fetch();

        expect(wrapper.vm.stories).toEqual(expected);
      });

      it('stores the total number of stories', async() => {
        const wrapper = factory({ data: { perPage: 2 } });
        const expected = storiesPageContentfulResponse.data.data.exhibitionPageCollection.items.length +
          storiesPageContentfulResponse.data.data.blogPostingCollection.items.length;

        await wrapper.vm.fetch();

        expect(wrapper.vm.total).toEqual(expected);
      });
    });

    describe('when new stories page is disabled', () => {
      const $features = { newStoriesPage: false };
      it('does not fetch content from Contentful', async() => {
        const wrapper = factory({ $features });

        await wrapper.vm.fetch();

        expect(wrapper.vm.$contentful.query.called).toBe(false);
      });
    });
  });

  describe('head', () => {
    it('uses localised page title for title meta field', () => {
      const wrapper = factory();

      const headMeta = wrapper.vm.head().meta;

      expect(headMeta.find(meta => meta.name === 'title')?.content).toBe('storiesPage.title');
    });
  });

  describe('methods', () => {
    describe('entryUrl', () => {
      it('prefixes BlogPosting entries with /blog', () => {
        const wrapper = factory();

        const entryUrl = wrapper.vm.entryUrl({
          '__typename': 'BlogPosting',
          identifier: 'interesting'
        });

        expect(entryUrl).toBe('/blog/interesting');
      });

      it('prefixes ExhibitionPage entries with /exhibitions', () => {
        const wrapper = factory();

        const entryUrl = wrapper.vm.entryUrl({
          '__typename': 'ExhibitionPage',
          identifier: 'educational'
        });

        expect(entryUrl).toBe('/exhibitions/educational');
      });
    });
  });
});
