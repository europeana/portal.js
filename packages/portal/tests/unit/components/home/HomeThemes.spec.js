import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import sinon from 'sinon';

import HomeThemes from '@/components/home/HomeThemes.vue';
import * as useContentfulGraphqlModule from '@/composables/contentful/useContentfulGraphql.js';

const localVue = createLocalVue();

const contentfulQueryResponse = {
  data: {
    data: {
      themePageCollection: {
        items: [
          {
            identifier: 'art',
            name: 'Art',
            description: 'The Art theme',
            primaryImageOfPage: { image: { url: 'https://example.org/art.jpeg' } }
          },
          {
            identifier: 'archaeology',
            name: 'Archaeology',
            description: 'The Archaeology theme',
            primaryImageOfPage: { image: { url: 'https://example.org/archaeology.jpeg' } }
          }
        ]
      }
    }
  }
};
const themes = [
  {
    title: 'Archaeology',
    description: 'The Archaeology theme',
    url: '/',
    image: { url: 'https://example.org/archaeology.jpeg' }
  },
  {
    title: 'Art',
    description: 'The Art theme',
    url: '/',
    image: { url: 'https://example.org/art.jpeg' }
  }
];

const contentfulQueryStub = sinon.stub();
contentfulQueryStub.resolves(contentfulQueryResponse);

const factory = () => shallowMountNuxt(HomeThemes, {
  localVue,
  mocks: {
    $i18n: {
      localeProperties: { iso: 'en-GB' }
    },
    $route: {
      query: {}
    },
    localePath: sinon.stub().returns('/'),
    $t: (key) => key
  }
});

describe('components/home/HomeThemes', () => {
  beforeAll(() => {
    sinon.stub(useContentfulGraphqlModule, 'useContentfulGraphql').returns({
      query: contentfulQueryStub
    })
  });
  afterEach(sinon.resetHistory);
  afterAll(sinon.restore);

  describe('template', () => {
    describe('when there are themes', () => {
      it('renders the StackedCardsSwiper', async() => {
        const wrapper = factory();
        await wrapper.setData({ themes });

        const stackedCardsSwiperStub = wrapper.find('stackedcardsswiper-stub');

        expect(stackedCardsSwiperStub.isVisible()).toBe(true);
      });
    });

    describe('when there are not themes', () => {
      it('does not render the StackedCardsSwiper', () => {
        const wrapper = factory();

        const stackedCardsSwiperStub = wrapper.find('stackedcardsswiper-stub');

        expect(stackedCardsSwiperStub.exists()).toBe(false);
      });
    });
  });

  describe('fetch', () => {
    it('queries CTF for the themes', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(contentfulQueryStub.calledWith(sinon.match((ast) => ast?.definitions?.[0]?.name?.value === 'Themes'), {
        locale: 'en-GB',
        preview: false
      })).toBe(true);
    });

    it('stores the parsed & sorted themes', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(wrapper.vm.themes).toEqual(themes);
    });
  });
});
