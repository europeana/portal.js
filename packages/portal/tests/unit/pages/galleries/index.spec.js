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
  '@context': 'http://www.europeana.eu/schemas/context/collection.jsonld',
  type: 'ResultPage',
  partOf: {
    type: 'ResultList',
    total: 2
  },
  total: 2,
  items: [
    {
      id: 'http://data.europeana.eu/set/4279',
      type: 'Collection',
      title: {
        en: 'Dizzy Gillespie'
      },
      description: {
        en: '\'The Ambassador of Jazz\' revolutionized the genre in the 1940s by being one of the fathers of bebop and infusing it later with Afro-Cuban rhythms. After a lucky accident, the bent bell trumpet became his trademark.'
      },
      visibility: 'published',
      items: [
        'http://data.europeana.eu/item/191/item_D4UCMBDUPV2QGEDH7NJUTED2L3M2BJXQ',
        'http://data.europeana.eu/item/9200516/ark__12148_bpt6k88304475',
        'http://data.europeana.eu/item/9200516/ark__12148_bpt6k88219594',
        'http://data.europeana.eu/item/9200516/ark__12148_bpt6k8838693k',
        'http://data.europeana.eu/item/191/item_BTIJOKWU2F3C36WLI26G5QD4CKOMKAOL'
      ],
      creator: {
        id: 'http://data.europeana.eu/user/5c2bacfd-0f23-4c22-bbb9-877342726c15',
        nickname: 'entitygalleries'
      },
      created: '2022-07-21T11:29:21Z',
      modified: '2022-07-21T11:29:21Z',
      total: 5
    },
    {
      id: 'http://data.europeana.eu/set/4278',
      type: 'Collection',
      title: {
        en: 'Anti-Apartheid movement'
      },
      description: {
        en: 'Apartheid was a racist segregation system in South Africa and South West Africa from 1948 to 1990. These posters, photographs and objects document anti-apartheid movements across Europe, in solidatory with Black South Africans.'
      },
      visibility: 'published',
      items: [
        'http://data.europeana.eu/item/180/10622_685031B1_9C63_4D0E_80DB_7F03BDC89146_cho',
        'http://data.europeana.eu/item/08547/sgml_eu_php_obj_p0014553',
        'http://data.europeana.eu/item/2021624/https___hdl_handle_net_11653_obj323',
        'http://data.europeana.eu/item/180/10622_4449E11C_9294_45CD_8DED_D1EB3BDBA8D6_cho',
        'http://data.europeana.eu/item/180/10622_9D3C9003_3E59_4F33_8372_10B519D78885_cho',
        'http://data.europeana.eu/item/180/10622_E7D173EE_2F68_4333_9956_C99505C3ABD7_cho'
      ],
      creator: {
        id: 'http://data.europeana.eu/user/5c2bacfd-0f23-4c22-bbb9-877342726c15',
        nickname: 'entitygalleries'
      },
      created: '2022-07-21T11:29:20Z',
      modified: '2022-07-21T11:29:21Z',
      total: 6
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
          page: 0,
          profile: 'items.meta'
        }
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
