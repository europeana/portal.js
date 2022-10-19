import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../utils';
import sinon from 'sinon';

import mixin from '@/mixins/allThemes';

const component = {
  template: '<div></div>',
  mixins: [mixin]
};

const localVue = createLocalVue();

const contentfulResponse = {
  data: {
    data: {
      curatedEntities: {
        items: [
          {
            name: 'World War I',
            nameEN: 'World War I',
            identifier: 'http://data.europeana.eu/concept/83',
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
            nameEN: 'Manuscripts',
            identifier: 'http://data.europeana.eu/concept/17',
            genre: 'manuscript'
          }
        ]
      }
    }
  }
};

const contentfulQuery = sinon.stub().resolves(contentfulResponse);
const storeCommit = sinon.spy();

const factory = (options = {}) => shallowMountNuxt(component, {
  localVue,
  mocks: {
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

describe('mixins/allThemes', () => {
  afterEach(sinon.resetHistory);

  describe('displaying quick search for the first time', () => {
    it('fetches the overrides and saves them in search and entity store', async() => {
      const wrapper = factory();

      await wrapper.vm.fetchAllThemes();

      expect(contentfulQuery.called).toBe(true);
      expect(storeCommit.calledWith('entity/setCuratedEntities', sinon.match.any)).toBe(true);
      expect(storeCommit.calledWith('search/setAllThemes', sinon.match.any)).toBe(true);
    });
  });

  describe('displaying quick search with curatedEntities already stored', () => {
    it('saves the overrides in search store, does not refetch curated data', async() => {
      const wrapper = factory({ curatedEntities: contentfulResponse.data.data.curatedEntities.items });

      await wrapper.vm.fetchAllThemes();

      expect(contentfulQuery.called).toBe(false);
      expect(storeCommit.calledWith('entity/setCuratedEntities', sinon.match.any)).toBe(false);
      expect(storeCommit.calledWith('search/setAllThemes', sinon.match.any)).toBe(true);
    });
  });

  describe('displaying quick search with themes already stored', () => {
    it('does not fetch or store anything', async() => {
      const wrapper = factory({ themes: ['theme1', 'theme2'] });

      await wrapper.vm.fetchAllThemes();

      expect(contentfulQuery.called).toBe(false);
      expect(storeCommit.calledWith('entity/setCuratedEntities', sinon.match.any)).toBe(false);
      expect(storeCommit.calledWith('search/setAllThemes', sinon.match.any)).toBe(false);
    });
  });
});
