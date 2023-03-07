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
      browsePageCollection: {
        items: [
          {
            image: {
              url: 'https://www.europeana.eu/example.jpg',
              description: 'image description'
            },
            hasPartCollection: {
              items: [
                { '__typename': 'PrimaryCallToAction', name: 'PrimaryCTA', relatedLink: {}, text: '' }
              ]
            }
          }
        ]
      }
    }
  }
};
const categoriesContentfulResponse = {
  data: {
    data: {
      categoryCollection: {
        items: [
          { identifier: '3d', name: '3D' },
          { identifier: 'cooking', name: 'cooking' },
          { identifier: 'postcards', name: 'postcards' }
        ]
      }
    }
  }
};
const storiesMinimalContentfulResponse = {
  data: {
    data: {
      blogPostingCollection: {
        items: [
          { date: '2022-02-12T08:00:00.000+01:00', sys: { id: '796f5YKe4b1u8uXtizSBu0' }, cats: { items: [{ id: '3d' }, null] } }
        ]
      },
      exhibitionPageCollection: {
        items: [
          { date: '2022-03-12T08:00:00.000+01:00', sys: { id: '1tuVL9nnfMJzptXshe3Qw8' }, cats: { items: [{ id: 'cooking' }] } },
          { date: '2022-01-12T08:00:00.000+01:00', sys: { id: '3KgVELZ48RKM4kbxJ0bYKi' }, cats: { items: [{ id: 'cooking' }, { id: 'postcards' }] } }
        ]
      }
    }
  }
};
const storiesBySysIdContentfulResponse = {
  data: {
    data: {
      blogPostingCollection: {
        items: [
          {
            __typename: 'BlogPosting',
            sys: {
              id: '796f5YKe4b1u8uXtizSBu0'
            },
            identifier: 'the-1920-olympics-games-in-antwerp',
            name: 'The 1920 Olympics Games in Antwerp',
            primaryImageOfPage: {
              image: {
                url: 'https://images.ctfassets.net/i01duvb6kq77/7Jnq4yka0vfYdWKo7IV7Dc/5778788f0359b1a6a81ef1f57a260982/feature_1920Olympics.jpg',
                contentType: 'image/jpeg'
              }
            }
          }
        ]
      },
      exhibitionPageCollection: {
        items: [
          {
            __typename: 'ExhibitionPage',
            sys: {
              id: '1tuVL9nnfMJzptXshe3Qw8'
            },
            identifier: 'the-images-that-shaped-europe',
            name: 'The images that shaped Europe',
            primaryImageOfPage: {
              image: {
                url: 'https://images.ctfassets.net/i01duvb6kq77/2X3RporIb4EYdG60jkKWcq/381755491830d3ef1066bd9b848900dc/hero_eu_test.jpg',
                contentType: 'image/jpeg'
              }
            }
          },
          {
            __typename: 'ExhibitionPage',
            sys: {
              id: '3KgVELZ48RKM4kbxJ0bYKi'
            },
            identifier: 'the-jean-monnet-house',
            name: 'The Jean Monnet House',
            primaryImageOfPage: {
              image: {
                url: 'https://images.ctfassets.net/i01duvb6kq77/2X3RporIb4EYdG60jkKWcq/381755491830d3ef1066bd9b848900dc/hero_eu_test.jpg',
                contentType: 'image/jpeg'
              }
            }
          }
        ]
      }
    }
  }
};

const contentfulQueryStub = () => {
  const stub = sinon.stub();

  stub.withArgs('storiesPage', sinon.match.object).resolves(storiesPageContentfulResponse);
  stub.withArgs('categories', sinon.match.object).resolves(categoriesContentfulResponse);
  stub.withArgs('storiesMinimal', sinon.match.object).resolves(storiesMinimalContentfulResponse);
  stub.withArgs('storiesBySysId', sinon.match.object).resolves(storiesBySysIdContentfulResponse);

  return stub;
};

const factory = ({ $features = {}, data = {}, $fetchState = {}, mocks = {} } = {}) => shallowMountNuxt(StoriesPage, {
  localVue,
  data() {
    return data;
  },
  mocks: {
    $contentful: {
      query: contentfulQueryStub()
    },
    $features: {
      ...$features
    },
    $fetchState,
    $i18n: {
      locale: 'en',
      isoLocale: () => 'en-GB'
    },
    $route: { query: {} },
    $scrollTo: sinon.spy(),
    $t: (key) => key,
    $tc: (key) => key,
    ...mocks
  },
  stubs: ['b-card-group']
});

describe('pages/stories/index', () => {
  afterEach(sinon.resetHistory);

  describe('fetch', () => {
    describe('when new stories page is enabled', () => {
      it('fetches stories page content from Contentful', async() => {
        const wrapper = factory();

        await wrapper.vm.fetch();

        expect(wrapper.vm.$contentful.query.calledWith('storiesPage', {
          identifier: 'stories',
          locale: 'en-GB',
          preview: false
        })).toBe(true);
      });

      it('handles potentially not having a page in Contentful', async() => {
        const contentfulQueryStubNoStoriesPage = contentfulQueryStub();
        contentfulQueryStubNoStoriesPage
          .withArgs('storiesPage', sinon.match.object)
          .resolves({ data: { data: { browsePageCollection: { items: [] } } } });

        const wrapper = factory({ mocks: { $contentful: { query: contentfulQueryStubNoStoriesPage } } });
        await wrapper.vm.fetch();

        expect(wrapper.vm.sections).toEqual([]);
      });

      it('fetches all stories with minimal data from Contentful', async() => {
        const wrapper = factory();

        await wrapper.vm.fetch();

        expect(wrapper.vm.$contentful.query.calledWith('storiesMinimal', {
          locale: 'en-GB',
          preview: false
        })).toBe(true);
      });

      it('fetches page of stories with full data from Contentful', async() => {
        const wrapper = factory();

        await wrapper.vm.fetch();

        expect(wrapper.vm.$contentful.query.calledWith('storiesBySysId', {
          locale: 'en-GB',
          preview: false,
          limit: 24,
          ids: sinon.match(['1tuVL9nnfMJzptXshe3Qw8', '796f5YKe4b1u8uXtizSBu0', '3KgVELZ48RKM4kbxJ0bYKi'])
        })).toBe(true);
      });

      it('stores a page of the stories content, ordered by datePublished', async() => {
        const wrapper = factory({ data: { perPage: 2 } });
        const expected = [
          storiesBySysIdContentfulResponse.data.data.exhibitionPageCollection.items[0],
          storiesBySysIdContentfulResponse.data.data.blogPostingCollection.items[0],
          'cta-banner'
        ];

        await wrapper.vm.fetch();

        expect(wrapper.vm.stories).toEqual(expected);
      });

      it('stores the total number of stories', async() => {
        const wrapper = factory({ data: { perPage: 2 } });
        const expected = storiesMinimalContentfulResponse.data.data.exhibitionPageCollection.items.length +
          storiesMinimalContentfulResponse.data.data.blogPostingCollection.items.length;

        await wrapper.vm.fetch();

        expect(wrapper.vm.total).toEqual(expected);
      });

      it('scrolls to the page header element', async() => {
        const wrapper = factory();

        await wrapper.vm.fetch();

        expect(wrapper.vm.$scrollTo.calledWith('#header')).toBe(true);
      });

      describe('categories & tagged stories', () => {
        it('fetches categories from Contentful', async() => {
          const wrapper = factory();
          await wrapper.vm.fetch();

          expect(wrapper.vm.tags.length).toBe(3);
        });

        it('has a selected tag', async() => {
          const wrapper = factory();
          wrapper.vm.$route.query.tags = 'cooking';
          await wrapper.vm.fetch();

          expect(wrapper.vm.selectedTags.length).toBe(1);
        });

        it('optionally requests tagged stories', async() => {
          const wrapper = factory();
          wrapper.vm.$route.query.tags = 'cooking';
          await wrapper.vm.fetch();

          expect(wrapper.vm.stories.length).toBe(3);
        });
      });

      describe('when fetch errors', () => {
        it('renders an alert message', () => {
          const wrapper = factory({ $fetchState: { error: { message: 'Error message' } } });

          const alertMessage = wrapper.find('[data-qa="alert message container"]');

          expect(alertMessage.exists()).toBe(true);
        });
      });
    });
  });

  describe('pageMeta', () => {
    it('uses localised page title for title meta field', () => {
      const wrapper = factory();

      const pageMeta = wrapper.vm.pageMeta;

      expect(pageMeta.title).toBe('storiesPage.title');
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
