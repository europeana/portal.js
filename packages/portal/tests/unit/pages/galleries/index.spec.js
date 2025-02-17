import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import page from '@/pages/galleries/index';

const localVue = createLocalVue();
localVue.directive('masonry', {});
localVue.directive('masonry-tile', {});
localVue.use(BootstrapVue);

const setGalleriesResponse = {
  total: 2,
  items: [
    {
      id: 'http://data.europeana.eu/set/4279',
      type: 'Collection',
      title: {
        en: 'Dizzy Gillespie'
      },
      isShownBy: {},
      description: {
        en: '\'The Ambassador of Jazz\' revolutionized the genre in the 1940s by being one of the fathers of bebop and infusing it later with Afro-Cuban rhythms. After a lucky accident, the bent bell trumpet became his trademark.'
      },
      visibility: 'published'
    },
    {
      id: 'http://data.europeana.eu/set/4278',
      type: 'Collection',
      title: {
        en: 'Anti-Apartheid movement'
      },
      isShownBy: {},
      description: {
        en: 'Apartheid was a racist segregation system in South Africa and South West Africa from 1948 to 1990. These posters, photographs and objects document anti-apartheid movements across Europe, in solidatory with Black South Africans.'
      },
      visibility: 'published'
    }
  ]
};

const parsedGallerySets = [
  {
    description: { en: '\'The Ambassador of Jazz\' revolutionized the genre in the 1940s by being one of the fathers of bebop and infusing it later with Afro-Cuban rhythms. After a lucky accident, the bent bell trumpet became his trademark.' },
    title: { en: 'Dizzy Gillespie' },
    slug: '4279-dizzy-gillespie',
    thumbnail: 'thumbnail undefined'
  },
  {
    description: { en: 'Apartheid was a racist segregation system in South Africa and South West Africa from 1948 to 1990. These posters, photographs and objects document anti-apartheid movements across Europe, in solidatory with Black South Africans.' },
    title: { en: 'Anti-Apartheid movement' },
    slug: '4278-anti-apartheid-movement',
    thumbnail: 'thumbnail undefined'
  }
];

const setAPIStub = sinon.stub().resolves(setGalleriesResponse);

const factory = (options = {}) => shallowMountNuxt(page, {
  localVue,
  data() {
    return {
      total: 0,
      galleries: [],
      perPage: 24
    };
  },
  mocks: {
    $apis: {
      thumbnail: { edmPreview: (img) => `thumbnail ${img}` },
      set: {
        search: setAPIStub
      }
    },
    $store: {
      state: {
        sanitised: {
          page: 1
        }
      }
    },
    $t: key => key,
    $tc: key => key,
    $route: { query: {} },
    $i18n: {
      locale: 'fr'
    },
    $fetchState: options.fetchState || {},
    $auth: {
      loggedIn: false
    },
    asyncData: () => true
  },
  stubs: ['LoadingSpinner']
});

describe('Gallery index page', () => {
  sinon.resetHistory();

  describe('pageMeta', () => {
    it('sets the page title as galleries.galleries (from locale file)', () => {
      const wrapper = factory();

      const headTitle = wrapper.vm.pageMeta.title;

      expect(headTitle).toEqual('galleries.galleries');
    });
  });

  describe('while loading', () => {
    const wrapper = factory({ fetchState: { pending: true } });
    it('shows a loading spinner', async() => {
      const loadingSpinner = wrapper.find('loadingspinner-stub');

      expect(loadingSpinner.isVisible()).toBe(true);
    });
  });

  describe('when fetching results in an error', () => {
    const wrapper = factory({ fetchState: { error: { message: 'Something went wrong' } } });

    it('shows an alert message', async() => {
      const alertMessage = wrapper.find('[data-qa="alert message container"]');

      expect(alertMessage.exists()).toBe(true);
    });
  });

  describe('fetch', () => {
    it('requests the sets from the user set API endpoint', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(setAPIStub.calledWith(
        {
          query: 'visibility:published',
          qf: 'lang:fr',
          pageSize: 24,
          page: 1,
          profile: 'items.meta'
        }, { withMinimalItemPreviews: true }
      )).toBe(true);
      expect(wrapper.vm.galleries).toEqual(parsedGallerySets);
    });
  });

  describe('methods', () => {
    describe('parseSets', () => {
      it('selects and formats the relevant fields', () => {
        const wrapper = factory();

        const parsedSets = wrapper.vm.parseSets(setGalleriesResponse.items);
        expect(parsedSets).toEqual(parsedGallerySets);
      });
    });

    describe('setPreviewUrl', () => {
      it('uses the thumbnail plugin edmPreview at 400px', () => {
        const wrapper = factory();

        const previewUrl = wrapper.vm.setPreviewUrl('https://example.org/edmPreview.jpg');
        expect(previewUrl).toEqual('thumbnail https://example.org/edmPreview.jpg');
      });
    });
  });
});
