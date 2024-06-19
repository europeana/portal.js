import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import cloneDeep from 'lodash/cloneDeep';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import StoriesInterface from '@/components/stories/StoriesInterface.vue';

const localVue = createLocalVue();

localVue.use(BootstrapVue);

const fullPropsData = {
  callToAction: {
    name: 'call to action',
    text: 'click me!',
    link: '#',
    illustration: {}
  },
  featuredStory: {
    sys: { id: 'sys-id' },
    name: 'Story title',
    headline: 'Story headline',
    identifier: 'story-title',
    image: { url: 'https://www.example.com/image.jpg' },
    categoriesCollection: {
      items: [
        { identifier: 'cooking' },
        { identifier: 'postcards' }
      ]
    }
  }
};

const storiesMinimalContentfulResponse = {
  data: {
    data: {
      storyCollection: {
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
      storyCollection: {
        items: [
          {
            __typename: 'Story',
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

const allStoryMetadata = [
  {
    cats: ['cooking'],
    date: '2022-03-12T08:00:00.000+01:00',
    sys: {
      id: '1tuVL9nnfMJzptXshe3Qw8'
    }
  },
  {
    cats: ['3d'],
    date: '2022-02-12T08:00:00.000+01:00',
    sys: {
      id: '796f5YKe4b1u8uXtizSBu0'
    }
  },
  {
    cats: ['cooking', 'postcards'],
    date: '2022-01-12T08:00:00.000+01:00',
    sys: {
      id: '3KgVELZ48RKM4kbxJ0bYKi'
    }
  }
];

const contentfulQueryStub = () => {
  const stub = sinon.stub();

  stub.withArgs('storiesMinimal', sinon.match.object).resolves(cloneDeep(storiesMinimalContentfulResponse));
  stub.withArgs('storiesBySysId', sinon.match.object).resolves(cloneDeep(storiesBySysIdContentfulResponse));

  return stub;
};

const factory = ({ data = {}, propsData = {}, $fetchState = {}, mocks = {} } = {}) => shallowMountNuxt(StoriesInterface, {
  localVue,
  data() {
    return data;
  },
  propsData,
  mocks: {
    $contentful: {
      query: contentfulQueryStub()
    },
    $i18n: {
      locale: 'en',
      localeProperties: { iso: 'en-GB' }
    },
    $route: {
      query: {
        page: '1'
      }
    },
    $scrollTo: sinon.stub(),
    $fetchState,
    $t: (key) => key,
    $tc: (key) => key,
    ...mocks
  },
  stubs: ['StoriesFeaturedCard']
});

describe('components/stories/StoriesInterface', () => {
  describe('while the fetch state is pending', () => {
    it('show a loading spinner', async() => {
      const wrapper = factory({ $fetchState: { pending: true } });

      const spinner = wrapper.find('loadingspinner-stub');

      expect(spinner.exists()).toBe(true);
    });
  });

  describe('when the fetch state is complete', () => {
    it('show a loading spinner', async() => {
      const wrapper = factory({ $fetchState: { pending: false } });

      const spinner = wrapper.find('loadingspinner-stub');

      expect(spinner.exists()).toBe(false);
    });
  });

  describe('fetch', () => {
    it('fetches all stories with minimal data from Contentful', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(wrapper.vm.$contentful.query.calledWith('storiesMinimal', {
        locale: 'en-GB',
        preview: false,
        excludeSysId: ''
      })).toBe(true);
    });

    describe('when there is a featured story', () => {
      it('excludes it from those fetched', async() => {
        const wrapper = factory({ propsData: fullPropsData });

        await wrapper.vm.fetch();

        expect(wrapper.vm.$contentful.query.calledWith('storiesMinimal', {
          locale: 'en-GB',
          preview: false,
          excludeSysId: fullPropsData.featuredStory.sys.id
        })).toBe(true);
      });
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
  });

  describe('computed', () => {
    describe('selectedTags', () => {
      it('defaults to an empty array', async() => {
        const wrapper = factory();
        await wrapper.vm.fetch();

        expect(wrapper.vm.selectedTags).toEqual([]);
      });

      it('has a selected tag when one is present in the URL', async() => {
        const wrapper = factory({ mocks: { $route: { query: { tags: 'cooking' } } } });
        expect(wrapper.vm.selectedTags.length).toBe(1);
      });

      it('has multiple tags when present in the URL', async() => {
        const wrapper = factory({ mocks: { $route: { query: { tags: 'cooking,art,manuscripts' } } } });
        await wrapper.vm.fetch();

        expect(wrapper.vm.selectedTags.length).toBe(3);
      });
    });

    describe('filteredTags', () => {
      describe('when stories are filtered to a tag', () => {
        it('selects and sorts catagories that are shared with the active filter', async() => {
          const wrapper = factory({ data: { allStoryMetadata }, mocks: { $route: { query: { tags: 'cooking' } } } });

          const filteredTags = wrapper.vm.filteredTags;

          expect(filteredTags).toEqual(['cooking', 'postcards']);
        });
      });
    });

    describe('relevantStoryMetadata', () => {
      describe('when no tags are selected', () => {
        it('defaults to all stories', async() => {
          const wrapper = factory({ data: { allStoryMetadata } });

          const relevantStoryMetadata = wrapper.vm.relevantStoryMetadata;

          expect(relevantStoryMetadata).toBe(wrapper.vm.allStoryMetadata);
        });
      });

      describe('when a tag is selected', () => {
        it('only selects stories that have tags', async() => {
          const wrapper = factory({ data: { allStoryMetadata }, mocks: { $route: { query: { tags: 'cooking' } } } });

          const relevantStoryMetadata = wrapper.vm.relevantStoryMetadata;

          const expectedStoryData = allStoryMetadata.filter(story => story.cats.includes('cooking'));
          expect(relevantStoryMetadata).toEqual(expectedStoryData);
        });
      });
    });

    describe('total', () => {
      it('defaults to 0', async() => {
        const wrapper = factory();

        const total = wrapper.vm.total;

        expect(total).toEqual(0);
      });

      it('is based of the relevantStoryMetadata length', async() => {
        const wrapper = factory({ data: { allStoryMetadata } });

        const total = wrapper.vm.total;

        expect(total).toEqual(3);
      });

      it('takes into account applied tags', async() => {
        const wrapper = factory({ data: { allStoryMetadata }, mocks: { $route: { query: { tags: 'cooking' } } } });

        const total = wrapper.vm.total;

        expect(total).toEqual(2);
      });
    });

    describe('page', () => {
      it('defaults to 1 when no other value is in the URL', async() => {
        const wrapper = factory();
        await wrapper.vm.fetch();

        const page = wrapper.vm.page;

        expect(page).toBe(1);
      });

      it('uses the page value from the URL when present', async() => {
        const wrapper = factory({ mocks: { $route: { query: { page: '3' } } } });
        await wrapper.vm.fetch();

        const page = wrapper.vm.page;

        expect(page).toBe(3);
      });
    });
  });

  describe('methods', () => {
    describe('fetchStoryMetadata', () => {
      it('populates the story metadata and simplifies tag data', async() => {
        const wrapper = factory();

        await wrapper.vm.fetchStoryMetadata();

        const result = wrapper.vm.allStoryMetadata;
        expect(result).toEqual(allStoryMetadata);
      });
    });

    describe('fetchStories', () => {
      describe('when fetching without selected tags', () => {
        it('fetches from all the stories', async() => {
          const wrapper = factory({ data: { allStoryMetadata } });

          await wrapper.vm.fetchStories();

          expect(wrapper.vm.$contentful.query.calledWith('storiesBySysId', {
            locale: 'en-GB',
            preview: false,
            limit: 24,
            ids: sinon.match(['1tuVL9nnfMJzptXshe3Qw8', '796f5YKe4b1u8uXtizSBu0', '3KgVELZ48RKM4kbxJ0bYKi'])
          })).toBe(true);
        });

        it('orders stories by date published and inserts the CTA', async() => {
          const wrapper = factory({ data: { allStoryMetadata, perPage: 2 } });
          const expected = [
            storiesBySysIdContentfulResponse.data.data.exhibitionPageCollection.items[0],
            storiesBySysIdContentfulResponse.data.data.storyCollection.items[0],
            'cta-banner'
          ];

          await wrapper.vm.fetchStories();

          expect(wrapper.vm.stories).toEqual(expected);
        });

        describe('on the second page', () => {
          it('does NOT insert a cta', async() => {
            const wrapper = factory({
              data: {
                allStoryMetadata,
                perPage: 2
              },
              mocks: {
                $route: {
                  query: {
                    page: '2'
                  }
                }
              }
            });

            const expected = [
              storiesBySysIdContentfulResponse.data.data.exhibitionPageCollection.items[1]
            ];

            await wrapper.vm.fetchStories();

            const stories = wrapper.vm.stories;
            expect(stories).toEqual(expected);
          });
        });
      });

      it('scrolls to the page header element', async() => {
        const wrapper = factory({ data: { allStoryMetadata } });

        await wrapper.vm.fetchStories();

        expect(wrapper.vm.$scrollTo.calledWith('#header')).toBe(true);
      });

      describe('when fetching with selected tags', () => {
        it('filters the stories', async() => {
          const wrapper = factory({ data: { allStoryMetadata }, mocks: { $route: { query: { tags: 'cooking' } } } });
          await wrapper.vm.fetchStories();

          expect(wrapper.vm.stories.length).toBe(2);
        });
      });
    });
  });

  describe('when there is a featured story', () => {
    describe('and on the first page', () => {
      it('renders a featured story card', async() => {
        const wrapper = factory({ propsData: fullPropsData });

        expect(wrapper.find('[data-qa="featured story card"]').exists()).toBe(true);
      });
    });
    describe('and on the second page', () => {
      it('does NOT render a featured story card', async() => {
        const wrapper = factory({ propsData: fullPropsData, mocks: { $route: { query: { page: '2' } } } });

        expect(wrapper.find('[data-qa="featured story card"]').exists()).toBe(false);
      });
    });
    describe('and its tags match those applied', () => {
      it('renders a featured story card', async() => {
        const wrapper = factory({ propsData: fullPropsData, mocks: { $route: { query: { tags: 'cooking,postcards' } } } });

        expect(wrapper.find('[data-qa="featured story card"]').exists()).toBe(true);
      });
    });
    describe('but its tags do not match those applied', () => {
      it('renders a featured story card', async() => {
        const wrapper = factory({ propsData: fullPropsData, mocks: { $route: { query: { tags: 'sport' } } } });

        expect(wrapper.find('[data-qa="featured story card"]').exists()).toBe(false);
      });
    });
  });
});
