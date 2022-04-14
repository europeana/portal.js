import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import QuickSearch from '@/components/search/QuickSearch.vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const allThemes = [
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
];

const fetchThemes = sinon.stub().resolves(allThemes);
const storeCommit = sinon.spy();

const factory = () => shallowMountNuxt(QuickSearch, {
  localVue,
  mocks: {
    $path: () => 'mocked path',
    $t: (key) => key,
    $i18n: { locale: 'en' },
    $store: {
      state: { search: { allThemes: [] } },
      commit: storeCommit
    },
    $apis: { entity: { find: fetchThemes } }
  }
});

describe('components/search/QuickSearch', () => {
  describe('displaying quick search for the first time', () => {
    it('fetches the themes and saves them in search store', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(fetchThemes.called).toBe(true);
      expect(storeCommit.calledWith('search/set', ['allThemes', allThemes])).toBe(true);
    });
  });
  // it('shows chips', async() => {
  //   const wrapper = factory();

  //   const chips =  wrapper.findAll('[data-qa="quick search chips"]');
  //   expect(chips.length).toBe(3);
  // });
});
