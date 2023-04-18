
import { createLocalVue, shallowMount } from '@vue/test-utils';
import ItemDataProvider from '@/components/item/ItemDataProvider';

const localVue = createLocalVue();

const factory = () => shallowMount(ItemDataProvider, {
  localVue,
  propsData: {
    dataProvider: {
      value: {
        def: [
          {
            about: 'https://data.europeana.eu/organization/001',
            prefLabel: {
              en: 'Example organisation',
              nl: 'Voorbeeld organisatie'
            }
          }
        ]
      }
    }
  },
  mocks: {
    $i18n: { locale: 'en' },
    $t: (key) => key
  }
});

describe('components/item/ItemDataProvider', () => {
  it('displays the data provider attribution', () => {
    const wrapper = factory();

    const attribution = wrapper.find('[data-qa="data provider attribution"]');

    expect(attribution.exists()).toBe(true);
  });

  descibe('when the provider is present as an entity', () => {
    it('displays the data provider badge', () => {
      const wrapper = factory();

      const badge = wrapper.find('[data-qa="data provider badge"]');

      expect(badge.exists()).toBe(true);
    });

  });

  describe('when the provider is present as plain text only', () => {
    it('displays the data provider name', () => {
      const wrapper = factory();

      const name = wrapper.find('[data-qa="data provider name"]');

      expect(name.exists()).toBe(true);
    });

  });

  describe('fetch', () => {
    describe('when the provider is a europeana entity', () => {
      describe('when the entity can be retrieved', () => {
        it('uses the entity response', () => {
          const wrapper = factory();

          const providerEntity = wrapper.vm.providerEntity;

          expect(providerEntity).toBe(fromAPI);
        });
      });

      describe('when the entity can not be retrieved', () => {
        it('falls back to the props data', () => {
          const wrapper = factory();

          const providerEntity = wrapper.vm.providerEntity;

          expect(providerEntity).toBe(fromProps);
        });
      });
    });
  });

  describe('computed', () => {
    describe('isEuropeanaEntity', () => {
      it('uses the misnEntityUri Mixin to determine if the URL conforms', () => {
        const wrapper = factory();

        wrapper.vm.isEuropeanaEntity;

        expect(wrapper.vm.isEntityUri.calledWith('https://data.europeana.eu/organization/001')).toBe(true);
      });
    });

    describe('aboutURL', () => {
      it('uses the about field of the first "def" value', () =>{
        const wrapper = factory();

        const aboutURL = wrapper.vm.aboutURL;

        expect(aboutURL).toBe('https://data.europeana.eu/organization/001');
      });
    });

    describe('namePrefLanguage', () => {
      it('gets the pref language using the getPrefLanguage mixin', ()  => {
        const wrapper = factory();

        wrapper.vm.isEuropeanaEntity;

        expect(wrapper.vm.getPrefLanguage.calledWith('https://data.europeana.eu/organization/001')).toBe(true);
      });
    });

    describe('nativeName', () => {
      it('does a lang map for locale lookup on the name', () => {
        const wrapper = factory();

        const name = wrapper.vm.nativeName;

        expect(name).toBe('Voorbeeld organisatie');
      });
    });
  });
});
