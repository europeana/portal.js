
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
  describe('when the provider is present as an entity', () => {
    it('displays the data provider attribution', () => {
      const wrapper = factory();

      const attribution = wrapper.find('[data-qa="data provider attribution"]');

      expect(attribution.exists()).toBe(true);
    });

    it('displays the data provider badge', () => {
      const wrapper = factory();

      const badge = wrapper.find('[data-qa="data provider badge"]');

      expect(badge.exists()).toBe(true);
    });
  });

  describe('when the provider is present as a langmap', () => {
    it('displays the data provider attribution', () => {
      const wrapper = factory();

      const attribution = wrapper.find('[data-qa="data provider attribution"]');

      expect(attribution.exists()).toBe(true);
    });

    it('displays the data provider name', () => {
      const wrapper = factory();

      const name = wrapper.find('[data-qa="data provider name"]');

      expect(name.exists()).toBe(true);
    });
  });

  describe('when there is an isShownAt', () => {
    it('displays the data provider name', () => {
      const wrapper = factory();

      const link = wrapper.find('SmartLink[data-qa="data provider name"]');

      expect(link.exists()).toBe(true);
    });
  });

  describe('computed', () => {
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
      describe('when the provider is an entity', () => {
        it('defaults to null', () => {
          const wrapper = factory();

          const name = wrapper.vm.nativeName;

          expect(name).toBe(null);
        });
      });
    });
  });
});
