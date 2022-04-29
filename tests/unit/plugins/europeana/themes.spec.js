import { themes, themeOverrides } from '@/plugins/europeana/themes';
import sinon from 'sinon';

const themesData = [
  { id: 'http://data.europeana.eu/organization/1482250000002112001', prefLabel: 'National Library of France' },
  { id: 'http://data.europeana.eu/agent/base/59833', prefLabel: 'Voltaire' },
  { id: 'http://data.europeana.eu/agent/base/146742', prefLabel: 'Louis XVI of France' },
  { id: 'http://data.europeana.eu/concept/base/17', prefLabel: { en: 'Manusscript' } }
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
    query: {

    }
  },
  $contentful: {
    query: contentfulQueryStub
  }
};

describe('describe./@/plugins/europeana/themes', () => {
  beforeEach(() => {
    sinon.resetHistory();
  });

  describe('themeOverrides()', () => {
    describe('when curatedEntites are not yet stored', () => {
      beforeEach(() => {
        stubbedContext.$store.state.entity.curatedEntities = null;
      });

      it('gets the curatedEntities and stores them, overrides the passed property with those from contentful', async() => {
        const withOverrides = await themeOverrides(stubbedContext, themesData);
        const expectedOverrides = themesData;
        expectedOverrides[3].prefLabel = { en: 'Manuscripts' };

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
        const withOverrides = await themeOverrides(stubbedContext, themesData);
        const expectedOverrides = themesData;
        expectedOverrides[3].prefLabel = { en: 'Manuscripts' };

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
