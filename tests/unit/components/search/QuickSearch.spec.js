import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import QuickSearch from '@/components/search/QuickSearch.vue';
import sinon from 'sinon';

const fetchAllThemesSpy = sinon.spy();

const mixins = [
  {
    methods: {
      fetchAllThemes: fetchAllThemesSpy
    }
  }
];

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (options = {}) => shallowMountNuxt(QuickSearch, {
  localVue,
  mixins,
  mocks: {
    $i18n: {
      locale: 'en'
    },
    $t: (key) => key,
    $store: {
      state: {
        search: { allThemes: options.themes || [] }
      }
    }
  }
});

describe('components/search/QuickSearch', () => {
  it('fetches all themes', async() => {
    const wrapper = factory();
    await wrapper.vm.fetch();

    expect(fetchAllThemesSpy.called).toBe(true);
  });

  describe('when options or themes are available', () => {
    it('is rendered', async() => {
      const wrapper = factory({ themes: [{ prefLabel: { en: 'theme1' } }, { prefLabel: { en: 'theme2' } }] });
      const quickSearch = wrapper.find('[data-qa="quick-search"]');

      expect(quickSearch.exists()).toBe(true);
    });
  });
  describe('when no options and no themes', () => {
    it('is empty', async() => {
      const wrapper = factory();
      const quickSearch = wrapper.find('[data-qa="quick-search"]');

      expect(quickSearch.exists()).toBe(false);
    });
  });
});
