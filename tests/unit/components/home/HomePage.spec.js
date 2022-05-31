import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import HomePage from '@/components/home/HomePage';
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

const factory = (options = {}) => shallowMountNuxt(HomePage, {
  localVue,
  mixins,
  mocks: {
    $i18n: {
      locale: 'en',
      isoLocale: () => 'en-GB'
    },
    $store: {
      state: {
        search: { allThemes: options.themes || [] }
      }
    },
    $path: (args) => {
      return `${args.params.type}/${args.params.pathMatch}`;
    }
  }
});

describe('components/home/HomePage', () => {
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
});
