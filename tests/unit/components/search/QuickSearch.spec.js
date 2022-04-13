import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import QuickSearch from '@/components/search/QuickSearch.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const propsData = {
  links: [
    {
      id: 'http://data.europeana.eu/concept/base/80',
      prefLabel: {
        en: 'Archaeology'
      }
    },
    {
      id: 'http://data.europeana.eu/concept/base/83',
      prefLabel: {
        en: 'World War I'
      }
    },
    {
      id: 'http://data.europeana.eu/concept/base/114',
      prefLabel: {
        en: 'Sport'
      }
    }
  ]
};

const factory = () => shallowMount(QuickSearch, {
  localVue,
  propsData,
  mocks: {
    $path: () => 'mocked path',
    $t: (key) => key,
    $i18n: { locale: 'en' }
  }
});

describe('components/search/QuickSearch', () => {
  it('shows chips', async() => {
    const wrapper = factory();

    const chips =  wrapper.findAll('[data-qa="quick search chips"]');
    expect(chips.length).toBe(3);
  });
});
