import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '@test/utils.js';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import EntityBadges from '@/components/entity/EntityBadges.vue';
import * as backendFetchModule from '@/utils/backendFetch.js';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const relatedCollections = [
  {
    id: 'http://data.europeana.eu/agent/123',
    prefLabel: {
      de: 'Contentful title',
      en: 'Contentful title EN'
    },
    image: 'http://data.europeana.eu/item/123/ABC'
  },
  {
    id: 'http://data.europeana.eu/concept/194',
    prefLabel: {
      en: 'Visual arts'
    },
    isShownBy: {
      id: 'item2isShownById',
      source: 'http://data.europeana.eu/item/123/XYZ',
      thumbnail: 'thumbnailUrlItem2',
      type: 'WebResource'
    }
  },
  {
    id: 'http://data.europeana.eu/organzation/1',
    logo: {
      id: 'http://www.wikimedia.org/wiki/Special:FilePath/logoUrlItem3.jpg',
      source: 'www.wikimedia.org/wiki/Special:FilePath/logoUrlItem3'
    },
    prefLabel: {
      en: 'Europeana'
    }
  },
  {
    id: 'http://data.europeana.eu/concept/55',
    prefLabel: {
      en: 'Textile'
    }
  }
];

const entityUris = ['http://data.europeana.eu/concept/123', 'http://data.europeana.eu/agent/123'];

const factory = ({ propsData, mocks } = {}) => {
  return shallowMountNuxt(EntityBadges, {
    localVue,
    propsData: {
      title: 'title value',
      ...propsData
    },
    mocks: {
      $apis: {
        entity: {
          imageUrl: () => 'stubbedImageUrl'
        }
      },
      $t: () => {},
      $fetch: () => {},
      localePath: () => {},
      $store: {
        commit: sinon.spy()
      },
      $matomo: {
        trackEvent: sinon.spy()
      },
      $nuxt: { context: {} },
      ...mocks
    }
  });
};

describe('components/related/EntityBadges', () => {
  const backendFetch = sinon.stub(backendFetchModule, 'backendFetch');

  beforeEach(() => {
    backendFetch.withArgs('collections/retrieve', sinon.match.array, sinon.match.object)
      .resolves(relatedCollections);
  });
  afterEach(() => {
    sinon.resetHistory();
    sinon.resetBehavior();
  });
  afterAll(() => {
    sinon.restore();
  });

  describe('template', () => {
    describe('when related collections are present', () => {
      const data = { collections: relatedCollections };
      it('shows a section with related collections chips', async() => {
        const wrapper = factory();
        await wrapper.setData(data);

        const section = wrapper.find('[data-qa="related collections"]');
        expect(section.isVisible()).toBe(true);
      });

      it('contains four related chips', async() => {
        const wrapper = factory();
        await wrapper.setData(data);

        const chips = wrapper.findAll('linkbadge-stub');
        expect(chips.length).toBe(4);
      });

      describe('when a limit is set', () => {
        it('shows the limited amount of badges and a view all button', async() => {
          const limit = 2;
          const wrapper = factory({ propsData: { limit } });
          await wrapper.setData(data);

          const chips = wrapper.findAll('linkbadge-stub');
          const viewAllButton = wrapper.find('.view-all-button');

          expect(chips.length).toBe(limit);
          expect(viewAllButton.isVisible()).toBe(true);
        });

        describe('and the view all button is clicked', () => {
          it('shows all badges and NO view all button', async() => {
            const limit = 2;
            const wrapper = factory({ propsData: { limit } });
            await wrapper.setData(data);

            await wrapper.find('.view-all-button').trigger('click');

            const chips = wrapper.findAll('linkbadge-stub');
            const viewAllButton = wrapper.find('.view-all-button');

            expect(chips.length).toBe(4);
            expect(viewAllButton.exists()).toBe(false);
          });
        });
      });
    });

    describe('when no related collections are supplied', () => {
      describe('and no entity URIs are supplied', () => {
        it('is not rendered', () => {
          const wrapper = factory();

          const relatedCollections = wrapper.find('[data-qa="related collections"]');
          expect(relatedCollections.exists()).toBe(false);
        });
      });
    });
  });

  describe('fetch', () => {
    afterEach(sinon.resetHistory);

    describe('when related collections are supplied', () => {
      const propsData = { relatedCollections };

      it('uses them', async() => {
        const wrapper = factory({ propsData });

        await wrapper.vm.fetch();

        expect(wrapper.vm.collections).toEqual(relatedCollections);
      });
    });

    describe('when no related collections are supplied', () => {
      describe('but entity URIs are supplied', () => {
        const propsData = { entityUris };

        it('fetches entities with editorial overrides', async() => {
          const wrapper = factory({ propsData });

          await wrapper.vm.fetch();

          expect(backendFetch.calledWith(
            'collections/retrieve',
            [
              entityUris,
              {
                fl: 'id,prefLabel,isShownBy,logo,type'
              }
            ],
            wrapper.vm.$nuxt.context
          )).toBe(true);
        });
      });

      describe('and no entity URIs are supplied', () => {
        it('has no collections', async() => {
          const wrapper = factory();

          await wrapper.vm.fetch();

          expect(wrapper.vm.collections).toEqual([]);
        });
      });
    });
  });

  describe('methods', () => {
    describe('draw', () => {
      it('redraws Masonry', async() => {
        const wrapper = factory({ propsData: { relatedCollections } });
        wrapper.vm.$redrawVueMasonry = sinon.spy();

        await wrapper.vm.draw();

        expect(wrapper.vm.$redrawVueMasonry.called).toBe(true);
      });
    });

    describe('clickEventHandler', () => {
      it('sets the loggable interaction state', () => {
        const wrapper = factory();

        wrapper.vm.clickEventHandler();

        expect(wrapper.vm.$store.commit.calledWith('search/setLoggableInteraction', true)).toBe(true);
      });
    });
  });
});
