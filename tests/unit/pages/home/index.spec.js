import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import HomePage from '@/pages/home/index';
import sinon from 'sinon';

const localVue = createLocalVue();

const themes = [{
  id: 'http://data.europeana.eu/concept/base/83',
  prefLabel: { en: 'World War I' },
  description: { en: 'Collection of untold stories and official histories of World War I, in a unique blend of cultural heritage collections and personal items contributed by European citizens.' }
},
{
  id: 'http://data.europeana.eu/concept/base/80',
  prefLabel: { en: 'Archaeology' },
  description: { en: 'Explore all facets of archaeology from European museums, galleries, libraries and archives.' }
},
{
  id: 'http://data.europeana.eu/concept/base/190',
  prefLabel: { en: 'Art' },
  description: { en: 'Discover inspiring art, artists and stories in the digitised collections of European museums, galleries, libraries and archives. Explore paintings, drawings, engravings and sculpture from cultural heritage institutions across Europe.' }
}];

const swiperSlides = [{
  title: 'World War I',
  description: 'Collection of untold stories and official histories of World War I, in a unique blend of cultural heritage collections and personal items contributed by European citizens.',
  url: 'topic/83-world-war-i'
},
{
  title: 'Archaeology',
  description: 'Explore all facets of archaeology from European museums, galleries, libraries and archives.',
  url: 'topic/80-archaeology'
},
{
  title: 'Art',
  description: 'Discover inspiring art, artists and stories in the digitised collections of European museums, galleries, libraries and archives. Explore paintings, drawings, engravings and sculpture from cultural heritage institutions across Europe.',
  url: 'topic/190-art'
}];

const fetchAllThemesSpy = sinon.stub().resolves(themes);

const mixins = [
  {
    methods: {
      fetchAllThemes: fetchAllThemesSpy
    }
  }
];

const homePageContentfulResponse = {
  data: {
    data: {
      homePageCollection: {
        items: [
          {
            sectionsCollection: {
              items: []
            }
          }
        ]
      }
    }
  }
};

const factory = ({ themes = [], $features = {}, data = {} } = {}) => shallowMountNuxt(HomePage, {
  localVue,
  mixins,
  data() {
    return data;
  },
  mocks: {
    $contentful: {
      query: sinon.stub().resolves(homePageContentfulResponse)
    },
    $features: {
      newHomepage: true,
      ...$features
    },
    $i18n: {
      locale: 'en',
      isoLocale: () => 'en-GB'
    },
    $pageHeadTitle: (text) => text,
    $route: { query: {} },
    $t: (key) => key,
    $store: {
      state: {
        search: { allThemes: themes }
      }
    },
    $path: (args) => {
      return `${args.params.type}/${args.params.pathMatch}`;
    }
  },
  stubs: ['IndexPage']
});

describe('pages/home/index', () => {
  afterEach(sinon.resetHistory);

  describe('fetch', () => {
    describe('when new homepage is enabled', () => {
      it('fetches all themes', async() => {
        const wrapper = factory();
        await wrapper.vm.fetch();

        expect(fetchAllThemesSpy.called).toBe(true);
      });

      it('models the theme data to be used as swiper slides', async() => {
        const wrapper = factory({ themes });
        await wrapper.vm.fetch();

        expect(wrapper.vm.swiperThemes).toEqual(swiperSlides);
      });

      test.todo('fetches the homePage entry from Contentful');
    });

    describe('when new homepage is disabled', () => {
      it('does not fetch themes', async() => {
        const wrapper = factory({ $features: { newHomepage: false } });

        await wrapper.vm.fetch();

        expect(fetchAllThemesSpy.called).toBe(false);
      });

      test.todo('does not fetch the homePage entry from Contentful');
    });
  });

  describe('head', () => {
    it('uses localised page title for title meta field', () => {
      const wrapper = factory();

      const headMeta = wrapper.vm.head().meta;

      expect(headMeta.find(meta => meta.name === 'title')?.content).toBe('homePage.title');
    });
  });

  describe('computed', () => {
    describe('callsToAction', () => {
      it('returns the PrimaryCallToAction-type sections', () => {
        const data = {
          sections: [
            { '__typename': 'PrimaryCallToAction', name: 'Temporary', relatedLink: {}, text: '' },
            { '__typename': 'SomethingElse' },
            { '__typename': 'PrimaryCallToAction', name: 'Primary', relatedLink: {}, text: '' },
            { '__typename': 'PrimaryCallToAction', name: 'Seconday', relatedLink: {}, text: '' }
          ]
        };
        const wrapper = factory({ data });

        const ctas = wrapper.vm.callsToAction;

        expect(ctas).toEqual([
          { '__typename': 'PrimaryCallToAction', name: 'Temporary', relatedLink: {}, text: '' },
          { '__typename': 'PrimaryCallToAction', name: 'Primary', relatedLink: {}, text: '' },
          { '__typename': 'PrimaryCallToAction', name: 'Seconday', relatedLink: {}, text: '' }
        ]);
      });

      it('inserts `null` as the first element if fewer than 3 CTAs', () => {
        const data = {
          sections: [
            { '__typename': 'PrimaryCallToAction', name: 'Primary', relatedLink: {}, text: '' }
          ]
        };
        const wrapper = factory({ data });

        const ctas = wrapper.vm.callsToAction;

        expect(ctas).toEqual([
          null,
          { '__typename': 'PrimaryCallToAction', name: 'Primary', relatedLink: {}, text: '' }
        ]);
      });
    });
  });
});
