import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import EntityBadges from '@/components/entity/EntityBadges.vue';

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
      ...mocks
    }
  });
};

describe('components/related/EntityBadges', () => {
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

          wrapper.vm.$apis = { entity: { find: sinon.stub().resolves([]) } };

          await wrapper.vm.fetch();

          expect(wrapper.vm.$apis.entity.find.calledWith(entityUris)).toBe(true);
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
