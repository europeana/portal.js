import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import RelatedCollections from '@/components/related/RelatedCollections.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const relatedCollections = [
  {
    description: 'This is a scpecially curated chip!',
    identifier: 'http://data.europeana.eu/agent/base/123',
    image: 'imageUrlItem1',
    name: 'Entity from contentful',
    slug: '123-entity-from-contentful'
  },
  {
    id: 'http://data.europeana.eu/concept/base/194',
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
    id: 'http://data.europeana.eu/organzation/base/1',
    logo: {
      id: 'http://www.wikimedia.org/wiki/Special:FilePath/logoUrlItem3.jpg',
      source: 'www.wikimedia.org/wiki/Special:FilePath/logoUrlItem3'
    },
    prefLabel: {
      en: 'Europeana'
    }
  },
  {
    id: 'http://data.europeana.eu/concept/base/207',
    prefLabel: {
      en: 'Byzantine art'
    }
  }
];
const entityApiFindResponse = relatedCollections.filter(entity => entity.id);
const entityUris = entityApiFindResponse.map(entity => entity.id);

const factory = ({ propsData, mocks } = {}) => {
  return shallowMountNuxt(RelatedCollections, {
    localVue,
    propsData,
    stubs: ['b-container'],
    mocks: {
      $apis: {
        entity: {
          imageUrl: sinon.spy(),
          find: sinon.stub().resolves(entityApiFindResponse)
        }
      },
      $i18n: { locale: 'de' },
      $t: () => {},
      $fetch: () => {},
      $path: (args) => {
        return `${args.params.type} - ${args.params.pathMatch}`;
      },
      $link: {
        to: route => route,
        href: () => null
      },
      ...mocks
    }
  });
};

describe('components/related/RelatedCollections', () => {
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
        it('is not visible', () => {
          const wrapper = factory();

          const relatedCollections = wrapper.find('[data-qa="related collections"]');
          expect(relatedCollections.isVisible()).toBe(false);
        });
      });
    });
  });

  describe('hooks', () => {
    describe('fetch', () => {
      afterEach(sinon.resetHistory);

      describe('when related collections are supplied', () => {
        const propsData = { relatedCollections };

        it('uses them', async() => {
          const wrapper = factory({ propsData });

          await wrapper.vm.fetch();

          expect(wrapper.vm.collections).toEqual(relatedCollections);
        });

        it('does not query the Entity API', async() => {
          const wrapper = factory({ propsData });

          await wrapper.vm.fetch();

          expect(wrapper.vm.$apis.entity.find.called).toBe(false);
        });
      });

      describe('when no related collections are supplied', () => {
        describe('but entity URIs are supplied', () => {
          const propsData = { entityUris };

          it('queries the Entity API', async() => {
            const wrapper = factory({ propsData });

            await wrapper.vm.fetch();

            expect(wrapper.vm.$apis.entity.find.calledWith(entityUris)).toBe(true);
          });

          it('uses the response', async() => {
            const wrapper = factory({ propsData });

            await wrapper.vm.fetch();

            expect(wrapper.vm.collections).toEqual(entityApiFindResponse);
          });
        });

        describe('and no entity URIs are supplied', () => {
          it('does not query the Entity API', async() => {
            const wrapper = factory();

            await wrapper.vm.fetch();

            expect(wrapper.vm.$apis.entity.find.called).toBe(false);
          });

          it('has no collections', async() => {
            const wrapper = factory();

            await wrapper.vm.fetch();

            expect(wrapper.vm.collections).toEqual([]);
          });
        });
      });
    });

    describe('beforeDestroy', () => {
      it('triggers `draw` to hide component', async() => {
        const wrapper = factory();
        wrapper.vm.draw = sinon.spy();

        await wrapper.destroy();

        expect(wrapper.vm.draw.calledWith('hide')).toBe(true);
      });
    });
  });

  describe('methods', () => {
    describe('draw', () => {
      it('emits "show" when relatedCollections has members', async() => {
        const wrapper = factory({ propsData: { relatedCollections } });

        await wrapper.vm.draw();

        expect(wrapper.emitted('show').length).toBeGreaterThanOrEqual(1);
        expect(wrapper.emitted('hide')).toBe(undefined);
      });

      it('emits "hide" when relatedCollections is blank', async() => {
        const wrapper = factory({ propsData: { relatedCollections: [] } });

        await wrapper.vm.draw();

        expect(wrapper.emitted('hide').length).toBeGreaterThanOrEqual(1);
        expect(wrapper.emitted('show')).toBe(undefined);
      });

      it('redraws Masonry', async() => {
        const wrapper = factory({ propsData: { relatedCollections } });
        wrapper.vm.$redrawVueMasonry = sinon.spy();

        await wrapper.vm.draw();

        expect(wrapper.vm.$redrawVueMasonry.called).toBe(true);
      });
    });

    describe('linkGen', () => {
      describe('when the item has an identifier/it is a curated chip from contenful', () => {
        it('uses the identifier and name for the slug', () => {
          const wrapper = factory();
          expect(wrapper.vm.linkGen(relatedCollections[0])).toBe('person - 123-entity-from-contentful');
        });
      });

      describe('when the item has an id/it is a Europeana entity from a search request', () => {
        it('uses the id and the English prefLabel for the name', () => {
          const wrapper = factory();
          expect(wrapper.vm.linkGen(relatedCollections[1])).toBe('topic - 194-visual-arts');
        });
      });

      describe('when the item can not be identified as a Europeana entity', () => {
        it('is `null`', () => {
          const wrapper = factory();
          expect(wrapper.vm.linkGen({})).toBe(null);
        });
      });
    });
  });
});
