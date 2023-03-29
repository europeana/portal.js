
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
    $t: (key) => key
  }
});

describe('components/item/ItemDataProvider', () => {
  test('displays the data provider name', () => {
    const wrapper = factory();

    const name = wrapper.find('[data-qa="data provider name"]');

    expect(name.exists()).toBe(true);
  });
});
