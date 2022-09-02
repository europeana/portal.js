import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import RelatedCollections from '@/components/related/RelatedCollections.vue';

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

const contentfulResponse = {
  data: {
    data: {
      curatedEntities: {
        items: [
          {
            name: 'Mode',
            nameEN: 'Fashion',
            identifier: 'http://data.europeana.eu/concept/55',
            genre: 'fashion',
            primaryImageOfPage: {
              image: {
                url: 'https://images.ctfassets.net/i01duvb6kq77/792bNsvUU5gai7bWidjZoz/1d6ce46c91d5fbcd840e8cf8bfe376a3/206_item_QCZITS4J5WNRUS7ESLVJH6PSOCRHBPMI.jpg',
                contentType: 'image/jpeg'
              }
            }
          },
          {
            name: 'Manuscripts',
            identifier: 'http://data.europeana.eu/concept/17',
            genre: 'manuscript'
          }
        ]
      }
    }
  }
};

const contentfulQuery = sinon.stub().resolves(contentfulResponse);
const storeCommit = sinon.spy();

const entityApiFindResponse = relatedCollections.slice(1);
const entityUris = entityApiFindResponse.map(entity => entity.id);

const factory = ({ propsData, mocks, storeData } = {}) => {
  return shallowMountNuxt(RelatedCollections, {
    localVue,
    propsData: {
      title: 'title value',
      ...propsData
    },
    stubs: ['b-container'],
    mocks: {
      $apis: {
        entity: {
          imageUrl: () => 'stubbedImageUrl',
          find: sinon.stub().resolves(entityApiFindResponse)
        }
      },
      $i18n: {
        locale: 'de',
        isoLocale: () => 'de-DE'
      },
      $t: () => {},
      $fetch: () => {},
      $path: () => {},
      $route: { query: { mode: null } },
      $store: {
        state: {
          entity: {
            curatedEntities: storeData?.curatedEntities
          }
        },
        commit: storeCommit
      },
      $contentful: {
        query: contentfulQuery
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

        describe('when contentful theme/editorial overrides are stored', () => {
          const storeData = {
            curatedEntities: contentfulResponse.data.data.curatedEntities.items
          };
          it('queries the Entity API, does NOT re-query contentful or update stored values', async() => {
            const wrapper = factory({ propsData, storeData });

            await wrapper.vm.fetch();

            expect(wrapper.vm.$apis.entity.find.calledWith(entityUris)).toBe(true);
            expect(contentfulQuery.called).toBe(false);
            expect(storeCommit.calledWith('entity/setCuratedEntities', sinon.match.any)).toBe(false);
          });

          it('uses the API response, and stored overrides', async() => {
            const expected = entityApiFindResponse;
            expected[2] = {
              contentfulImage: {
                contentType: 'image/jpeg',
                url: 'https://images.ctfassets.net/i01duvb6kq77/792bNsvUU5gai7bWidjZoz/1d6ce46c91d5fbcd840e8cf8bfe376a3/206_item_QCZITS4J5WNRUS7ESLVJH6PSOCRHBPMI.jpg'
              },
              id: 'http://data.europeana.eu/concept/55',
              prefLabel: {
                de: 'Mode',
                en: 'Fashion'
              }
            };

            const wrapper = factory({ propsData, storeData });

            await wrapper.vm.fetch();

            expect(wrapper.vm.collections).toEqual(expected);
          });
        });

        describe('without theme/editorial overrides stored', () => {
          it('queries the Entity API, queries contentful and updates stored values', async() => {
            const wrapper = factory({ propsData });

            await wrapper.vm.fetch();

            expect(wrapper.vm.$apis.entity.find.calledWith(entityUris)).toBe(true);
            expect(contentfulQuery.called).toBe(true);
            expect(storeCommit.calledWith('entity/setCuratedEntities', sinon.match.any)).toBe(true);
          });

          it('uses the API response, and fetched overrides', async() => {
            const expected = entityApiFindResponse;
            expected[2] = {
              contentfulImage: {
                contentType: 'image/jpeg',
                url: 'https://images.ctfassets.net/i01duvb6kq77/792bNsvUU5gai7bWidjZoz/1d6ce46c91d5fbcd840e8cf8bfe376a3/206_item_QCZITS4J5WNRUS7ESLVJH6PSOCRHBPMI.jpg'
              },
              id: 'http://data.europeana.eu/concept/55',
              prefLabel: {
                de: 'Mode',
                en: 'Fashion'
              }
            };

            const wrapper = factory({ propsData });

            await wrapper.vm.fetch();

            expect(wrapper.vm.collections).toEqual(expected);
          });
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

    describe('collectionTitle', () => {
      it('uses native language for organisations', () => {
        const wrapper = factory();

        const title = wrapper.vm.collectionTitle({ type: 'Organization', prefLabel: { en: 'Museum', fr: 'Musée' } });

        expect(title).toEqual({ fr: 'Musée' });
      });

      it('uses full prefLabel for other entity types if available', () => {
        const wrapper = factory();

        const title = wrapper.vm.collectionTitle({ type: 'Concept', prefLabel: { en: 'Cartoon', es: 'Dibujo humorístico' } });

        expect(title).toEqual({ en: 'Cartoon', es: 'Dibujo humorístico' });
      });

      it('falls back to name', () => {
        const wrapper = factory();

        const title = wrapper.vm.collectionTitle({ name: 'Curated related entity' });

        expect(title).toBe('Curated related entity');
      });
    });
  });
});
