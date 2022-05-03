import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import QuickSearch from '@/components/search/QuickSearch.vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const contentfulResponse = {
  data: {
    data: {
      curatedEntities: {
        items: [
          {
            name: 'World War I',
            identifier: 'http://data.europeana.eu/concept/base/83',
            genre: 'ww1',
            primaryImageOfPage: {
              image: {
                url: 'https://images.ctfassets.net/i01duvb6kq77/792bNsvUU5gai7bWidjZoz/1d6ce46c91d5fbcd840e8cf8bfe376a3/206_item_QCZITS4J5WNRUS7ESLVJH6PSOCRHBPMI.jpg',
                contentType: 'image/jpeg'
              }
            }
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
    $route: { query: { mode: null } }
  }
});

describe('components/search/QuickSearch', () => {
  beforeEach(() => {
    sinon.resetHistory();
  });
  describe('displaying quick search for the first time', () => {
    it('fetches the overrides and saves them in search and entity store', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(contentfulQuery.called).toBe(true);
      expect(storeCommit.calledWith('entity/setCuratedEntities', sinon.match.any)).toBe(true);
      expect(storeCommit.calledWith('search/set', ['allThemes', sinon.match.any])).toBe(true);
    });
  });
  describe('displaying quick search with curatedEntities already stored', () => {
    it('saves the overrides in search store, does not refetch curated data', async() => {
      const wrapper = factory({ curatedEntities: contentfulResponse.data.data.curatedEntities.items });

      await wrapper.vm.fetch();

      expect(contentfulQuery.called).toBe(false);
      expect(storeCommit.calledWith('entity/setCuratedEntities', sinon.match.any)).toBe(false);
      expect(storeCommit.calledWith('search/set', ['allThemes', sinon.match.any])).toBe(true);
    });
  });
  describe('displaying quick search with themes already stored', () => {
    it('does not fetch or store anything', async() => {
      const wrapper = factory({ themes: ['theme1', 'theme2'] });

      await wrapper.vm.fetch();

      expect(contentfulQuery.called).toBe(false);
      expect(storeCommit.calledWith('entity/setCuratedEntities', sinon.match.any)).toBe(false);
      expect(storeCommit.calledWith('search/set', ['allThemes', sinon.match.any])).toBe(false);
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
