import { createLocalVue, shallowMount } from '@vue/test-utils';
// TODO: is this needed?
import BootstrapVue from 'bootstrap-vue';

import BrowseContentCard from '@/components/browse/BrowseContentCard.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (props = { fields: {} }) => shallowMount(BrowseContentCard, {
  localVue,
  propsData: props,
  mocks: {
    $apis: {
      config: { data: { url: 'http://data.europeana.eu' } },
      entity: { getEntityTypeHumanReadable: () => 'person' },
      thumbnail: {
        edmPreview: (img) => img
      }
    },
    localePath: (opts) => opts,
    $i18n: { locale: 'en' },
    $t: () => {}
  }
});

describe('components/browse/BrowseContentCard', () => {
  describe('title()', () => {
    it('uses `fields.name`', () => {
      const name = 'Content item';
      const wrapper = factory({ fields: { name } });

      expect(wrapper.vm.title).toBe(name);
    });

    it('uses `dcTitleLangAware`', () => {
      const name = 'Content item';
      const dcTitleLangAware = 'Content item in a language';
      const wrapper = factory({
        cardType: 'AutomatedRecordCard',
        fields: {
          name,
          encoding: {
            dcTitleLangAware
          }
        }
      });

      expect(wrapper.vm.title).toBe(dcTitleLangAware);
    });
  });

  describe('imageUrl()', () => {
    describe('when `fields.image` is a string', () => {
      it('is used', () => {
        const image = 'https://www.example.org/image.jpg';
        const wrapper = factory({ fields: { image } });

        expect(wrapper.vm.imageUrl).toBe(image);
      });
    });

    describe('when the card is an AutomatedRecordCard and `edmPreview` is present', () => {
      it('is used', () => {
        const edmPreview = 'https://www.example.org/image.jpg';
        const wrapper = factory({
          cardType: 'AutomatedRecordCard',
          fields: {
            encoding: {
              edmPreview: [edmPreview]
            }
          }
        });

        expect(wrapper.vm.imageUrl).toBe(edmPreview);
      });
    });

    describe('when image is a Contentful asset', () => {
      it('uses `fields.image.url`', () => {
        const imageUrl = 'https://images.ctfassets.net/image.jpg';
        const wrapper = factory({ fields: { image: { url: imageUrl } } });

        expect(wrapper.vm.imageUrl).toBe(imageUrl);
      });
    });

    describe('otherwise', () => {
      it('is an empty string', () => {
        const wrapper = factory();

        expect(wrapper.vm.imageUrl).toBe('');
      });
    });
  });

  describe('destination()', () => {
    describe('when `fields.url` is present', () => {
      it('is used', () => {
        const url = 'https://www.example.org/';
        const wrapper = factory({ fields: { url } });

        expect(wrapper.vm.destination).toBe(url);
      });
    });

    describe('when `fields.identifier` is a Europeana record ID', () => {
      it('constructs a route to the record page', () => {
        const identifier = '/123456/abcdef_7890';
        const wrapper = factory({ fields: { identifier } });

        expect(wrapper.vm.destination).toEqual({ name: 'item-all', params: { pathMatch: identifier.slice(1) } });
      });
    });

    describe('when `fields.identifier` is a http(s) URL', () => {
      describe('and is a Europeana entity URI', () => {
        it('constructs a route to the entity page', () => {
          const entityType = 'agent';
          const entityHumanType = 'person';
          const entityId = '12345';
          const identifier = `http://data.europeana.eu/${entityType}/${entityId}`;
          const wrapper = factory({ fields: { identifier } });

          expect(wrapper.vm.destination).toEqual({ name: 'collections-type-all', params: { type: entityHumanType, pathMatch: entityId } });
        });
      });

      describe('but is not a Europeana entity URI', () => {
        it('is used', () => {
          const identifier = 'https://www.example.org/';
          const wrapper = factory({ fields: { identifier } });

          expect(wrapper.vm.destination).toEqual(identifier);
        });
      });
    });

    describe('otherwise', () => {
      it('is an empty string', () => {
        const wrapper = factory();

        expect(wrapper.vm.destination).toBe('');
      });
    });
  });

  describe('texts()', () => {
    describe('for a curated card', () => {
      it('is includes description', () => {
        const description = 'Some interesting content';
        const wrapper = factory({ fields: { description } });
        expect(wrapper.vm.texts).toContain(description);
      });
    });
    describe('for an automated record card', () => {
      it('is includes creator and provider fields, but no description', () => {
        const description = 'Some interesting content';
        const creator = 'A European artist';
        const provider = 'An aggregator';
        const wrapper = factory({ cardType: 'AutomatedRecordCard', fields: { description, creator, provider } });
        expect(wrapper.vm.texts).not.toContain(description);
        expect(wrapper.vm.texts).toContain(creator);
        expect(wrapper.vm.texts).toContain(provider);
      });
      it('is includes dcCreatorLangAware and dataProvider fields', () => {
        const dcCreatorLangAware = 'A European artist';
        const dataProvider = 'An aggregator';
        const wrapper = factory({
          cardType: 'AutomatedRecordCard',
          fields: {
            name,
            encoding: {
              dcCreatorLangAware,
              dataProvider
            }
          }
        });
        expect(wrapper.vm.texts).toContain(dcCreatorLangAware);
        expect(wrapper.vm.texts).toContain(dataProvider);
      });
    });
  });
});
