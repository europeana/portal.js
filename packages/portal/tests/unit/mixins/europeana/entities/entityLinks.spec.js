import { createLocalVue, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';
import mixin from '@/mixins/europeana/entities/entityLinks';

const component = {
  template: '<div></div>',
  mixins: [mixin]
};

const localVue = createLocalVue();

const entityUris = ['http://data.europeana.eu/concept/123', 'http://data.europeana.eu/agent/123'];

const entityApiFindResponse = [
  {
    id: 'http://data.europeana.eu/concept/123',
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
    id: 'http://data.europeana.eu/agent/123',
    prefLabel: {
      de: 'Contentful title',
      en: 'Contentful title EN'
    },
    image: 'http://data.europeana.eu/item/123/ABC'
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

const factory = () => {
  return shallowMount(component, {
    localVue,
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
      $path: () => {},
      $route: { query: { mode: null } },
      $store: {
        state: {
          entity: {
            curatedEntities: null
          }
        },
        commit: sinon.spy()
      },
      $contentful: {
        query: contentfulQuery,
        assets: {
          isValidUrl: (url) => url.includes('images.ctfassets.net'),
          optimisedSrc: (img) => `${img.url}?optimised`
        }
      },
      $link: {
        to: route => route,
        href: () => null
      }
    }
  });
};

describe('mixins/europeana/entities/entityLinks', () => {
  describe('methods', () => {
    describe('fetchReducedEntities', () => {
      it('requests the entity from the API', async() => {
        const wrapper = factory();

        await wrapper.vm.fetchReducedEntities(entityUris);

        expect(wrapper.vm.$apis.entity.find.calledWith(entityUris)).toBe(true);
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
