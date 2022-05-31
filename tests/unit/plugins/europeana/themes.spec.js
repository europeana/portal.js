import themes, { withEditorialContent } from '@/plugins/europeana/themes';
import sinon from 'sinon';

const themesData = [
  { id: 'http://data.europeana.eu/organization/1482250000002112001', prefLabel: 'National Library of France' },
  { id: 'http://data.europeana.eu/agent/base/59833', prefLabel: 'Voltaire' },
  { id: 'http://data.europeana.eu/concept/base/83', prefLabel: { en: 'World War I' } },
  { id: 'http://data.europeana.eu/concept/base/17', prefLabel: { en: 'Manusscript' } }
];

const contentfulResponse = {
  data: {
    data: {
      curatedEntities: {
        items: [
          {
            name: 'World War I',
            nameEN: 'World War I',
            identifier: 'http://data.europeana.eu/concept/base/83',
            genre: 'ww1',
            description: 'Collection of untold stories and official histories of World War I',
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
            identifier: 'http://data.europeana.eu/concept/base/17',
            genre: 'manuscript'
          }
        ]
      }
    }
  }
};

const storeCommitStub = sinon.stub().returns();
const contentfulQueryStub = sinon.stub().resolves(contentfulResponse);

const stubbedContext = {
  $store: {
    state: {
      entity: {
        curatedEntites: null
      }
    },
    commit: storeCommitStub
  },
  $i18n: {
    locale: 'en',
    isoLocale: () => 'en-GB'
  },
  $route: {
    query: {}
  },
  $contentful: {
    query: contentfulQueryStub
  }
};

describe('describe./@/plugins/europeana/themes', () => {
  beforeEach(() => {
    sinon.resetHistory();
  });

  describe('withEditorialContent()', () => {
    describe('when curatedEntites are not yet stored', () => {
      beforeEach(() => {
        stubbedContext.$store.state.entity.curatedEntities = null;
      });

      it('gets the curatedEntities and stores them, overrides the passed property with those from contentful', async() => {
        const withOverrides = await withEditorialContent(stubbedContext, themesData);
        const expectedOverrides = themesData;
        expectedOverrides[3].prefLabel = { en: 'Manuscripts' };
        expectedOverrides[2].contentfulImage = {
          url: 'https://images.ctfassets.net/i01duvb6kq77/792bNsvUU5gai7bWidjZoz/1d6ce46c91d5fbcd840e8cf8bfe376a3/206_item_QCZITS4J5WNRUS7ESLVJH6PSOCRHBPMI.jpg',
          contentType: 'image/jpeg'
        };
        expectedOverrides[2].description = { en: 'Collection of untold stories and official histories of World War I' };

        expect(contentfulQueryStub.called).toBe(true);
        expect(storeCommitStub.called).toBe(true);
        expect(withOverrides).toEqual(expectedOverrides);
      });
    });

    describe('when curatedEntites are already stored', () => {
      beforeEach(() => {
        stubbedContext.$store.state.entity.curatedEntities = contentfulResponse.data.data.curatedEntities.items;
      });

      it('does not re-retrieve or store the curatedEntities, overrides the passed property with those from the store', async() => {
        const withOverrides = await withEditorialContent(stubbedContext, themesData);
        const expectedOverrides = themesData;
        expectedOverrides[3].prefLabel = { en: 'Manuscripts' };
        expectedOverrides[2].description = { en: 'Collection of untold stories and official histories of World War I' };

        expect(contentfulQueryStub.called).toBe(false);
        expect(storeCommitStub.called).toBe(false);
        expect(withOverrides).toEqual(expectedOverrides);
      });
    });
  });

  describe('themes', () => {
    it('includes the 13 europeana themes', async() => {
      expect(themes.length).toBe(13);
    });
  });
});
