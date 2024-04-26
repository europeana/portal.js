import { createLocalVue, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';
import mixin from '@/mixins/europeana/entities/entityLinks';

const component = {
  template: '<div></div>',
  mixins: [mixin]
};

const localVue = createLocalVue();

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
      localePath: () => {},
      $route: { query: { mode: null } },
      $contentful: {
        assets: {
          isValidUrl: (url) => url.includes('images.ctfassets.net'),
          optimisedSrc: (img) => `${img.url}?optimised`
        }
      }
    }
  });
};

describe('mixins/europeana/entities/entityLinks', () => {
  describe('methods', () => {
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
