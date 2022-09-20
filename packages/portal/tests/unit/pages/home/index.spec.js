import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import HomePage from '@/pages/home/index';
import sinon from 'sinon';

const localVue = createLocalVue();

const themes = [
  {
    id: 'http://data.europeana.eu/concept/83',
    prefLabel: { en: 'World War I' },
    description: { en: 'Collection of untold stories and official histories of World War I, in a unique blend of cultural heritage collections and personal items contributed by European citizens.' }
  },
  {
    id: 'http://data.europeana.eu/concept/80',
    prefLabel: { en: 'Archaeology' },
    description: { en: 'Explore all facets of archaeology from European museums, galleries, libraries and archives.' }
  },
  {
    id: 'http://data.europeana.eu/concept/190',
    prefLabel: { en: 'Art' },
    description: { en: 'Discover inspiring art, artists and stories in the digitised collections of European museums, galleries, libraries and archives. Explore paintings, drawings, engravings and sculpture from cultural heritage institutions across Europe.' }
  }
];

const orderedSwiperSlides = [
  {
    title: 'Archaeology',
    description: 'Explore all facets of archaeology from European museums, galleries, libraries and archives.',
    url: 'topic/80-archaeology'
  },
  {
    title: 'Art',
    description: 'Discover inspiring art, artists and stories in the digitised collections of European museums, galleries, libraries and archives. Explore paintings, drawings, engravings and sculpture from cultural heritage institutions across Europe.',
    url: 'topic/190-art'
  },
  {
    title: 'World War I',
    description: 'Collection of untold stories and official histories of World War I, in a unique blend of cultural heritage collections and personal items contributed by European citizens.',
    url: 'topic/83-world-war-i'
  }
];

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
      assets: {
        optimisedSrc: sinon.spy((img) => `${img?.url}?optimised`)
      },
      query: sinon.stub().resolves(homePageContentfulResponse)
    },
    $features,
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
      return args.params ? `${args.params.type}/${args.params.pathMatch}` : args;
    },
    $fetchState: {}
  },
  stubs: ['IndexPage']
});

describe('pages/home/index', () => {
  afterEach(sinon.resetHistory);

  describe('fetch', () => {
    it('fetches all themes', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(fetchAllThemesSpy.called).toBe(true);
    });

    it('models the theme data to be used as swiper slides', async() => {
      const wrapper = factory({ themes });

      await wrapper.vm.fetch();

      expect(wrapper.vm.swiperThemes).toEqual(orderedSwiperSlides);
    });

    it('fetches the homePage entry from Contentful', async() => {
      const wrapper = factory({ themes });
      const clock = sinon.useFakeTimers();

      await wrapper.vm.fetch();

      expect(wrapper.vm.$contentful.query.calledWith('homePage', {
        locale: 'en-GB',
        preview: false,
        identifier: null,
        date: '1970-01-01T00:00:00.000Z'
      })).toBe(true);

      clock.restore();
    });
  });

  describe('head', () => {
    describe('meta', () => {
      it('uses localised page title for title field', () => {
        const wrapper = factory();

        const headMeta = wrapper.vm.head().meta;

        expect(headMeta.find(meta => meta.name === 'title')?.content).toBe('homePage.title');
      });

      it('uses localised page sub-headline for description field', () => {
        const wrapper = factory();

        const headMeta = wrapper.vm.head().meta;

        expect(headMeta.find(meta => meta.name === 'description')?.content).toBe('homePage.subHeadline');
      });

      describe('og:image', () => {
        const image = {
          url: 'https://images.ctfassets.net/image.jpeg',
          contentType: 'image/jpeg'
        };
        const expected = 'https://images.ctfassets.net/image.jpeg?optimised';

        it('favours CTF social media image', async() => {
          const wrapper = factory();
          await wrapper.setData({ socialMediaImage: image });
          await wrapper.vm.$nextTick();

          const headMeta = wrapper.vm.head().meta;

          expect(headMeta.find(meta => meta.property === 'og:image')?.content).toBe(expected);
        });

        it('falls back to CTF background image', async() => {
          const wrapper = factory();
          await wrapper.setData({ backgroundImage: { image } });
          await wrapper.vm.$nextTick();

          const headMeta = wrapper.vm.head().meta;

          expect(headMeta.find(meta => meta.property === 'og:image')?.content).toBe(expected);
        });
      });
    });
  });

  describe('computed', () => {
    describe('callsToAction', () => {
      it('returns the PrimaryCallToAction-type sections', () => {
        const data = {
          sections: [
            { '__typename': 'SomethingElse' },
            { '__typename': 'PrimaryCallToAction', name: 'Primary', relatedLink: {}, text: '' },
            { '__typename': 'PrimaryCallToAction', name: 'Seconday', relatedLink: {}, text: '' }
          ]
        };
        const wrapper = factory({ data });

        const ctas = wrapper.vm.callsToAction;

        expect(ctas).toEqual([
          { '__typename': 'PrimaryCallToAction', name: 'Primary', relatedLink: {}, text: '' },
          { '__typename': 'PrimaryCallToAction', name: 'Seconday', relatedLink: {}, text: '' }
        ]);
      });
    });
  });
});
