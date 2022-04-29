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

const contentfulResponse = {
  data: {
    data: {
      curatedEntities: {
        items: [
          {
            name: 'World War I',
            identifier: 'http://data.europeana.eu/concept/base/83',
            genre: 'ww1'
          },
          {
            name: 'Manuscripts',
            identifier: 'http://data.europeana.eu/concept/base/17',
            genre: 'manuscript'
          }
        ]
      }
    }
  }
};

const fetchThemes = sinon.stub().resolves(allThemes);
const contentfulQuery = sinon.stub().resolves(contentfulResponse);
const storeCommit = sinon.spy();

const factory = (options = {}) => shallowMountNuxt(QuickSearch, {
  localVue,
  mocks: {
    $path: () => 'mocked path',
    $t: (key) => key,
    $i18n: {
      locale: 'en',
      isoLocale: () => 'en-GB'
    },
    $store: {
      state: {
        search: { allThemes: options.themes || [] },
        entity: { curatedEntities: options.curatedEntities }
      },
      commit: storeCommit
    },
    $contentful: {
      query: contentfulQuery
    },
    $route: { query: { mode: null } },
    $apis: { entity: { find: fetchThemes } }
  }
});

describe('components/search/QuickSearch', () => {
  beforeEach(() => {
    sinon.resetHistory();
  });
  describe('displaying quick search for the first time', () => {
    it('fetches the themes and overrides and saves them in search an entity store', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(fetchThemes.called).toBe(true);
      expect(contentfulQuery.called).toBe(true);
      expect(storeCommit.calledWith('entity/setCuratedEntities', sinon.match.any)).toBe(true);
      expect(storeCommit.calledWith('search/set', ['allThemes', allThemes])).toBe(true);
    });
  });
  describe('displaying quick search with curatedEntities already stored', () => {
    it('fetches the themes and saves them in search store, does not refetch curated data', async() => {
      const wrapper = factory({ curatedEntities: contentfulResponse.data.data.curatedEntities.items });

      await wrapper.vm.fetch();

      expect(fetchThemes.called).toBe(true);
      expect(contentfulQuery.called).toBe(false);
      expect(storeCommit.calledWith('entity/setCuratedEntities', sinon.match.any)).toBe(false);
      expect(storeCommit.calledWith('search/set', ['allThemes', allThemes])).toBe(true);
    });
  });
  describe('displaying quick search with themes already stored', () => {
    it('does not fetch anything', async() => {
      const wrapper = factory({ themes: ['theme1', 'theme2'] });

      await wrapper.vm.fetch();

      expect(fetchThemes.called).toBe(false);
      expect(contentfulQuery.called).toBe(false);
      expect(storeCommit.calledWith('entity/setCuratedEntities', sinon.match.any)).toBe(false);
      expect(storeCommit.calledWith('search/set', ['allThemes', allThemes])).toBe(false);
    });
  });
  describe('when options or themes are available', () => {
    it('is rendered', async() => {
      const wrapper = factory({ themes: ['theme1', 'theme2'] });
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
