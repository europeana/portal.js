import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import ThemeBadges from '@/components/theme/ThemeBadges.vue';
import * as useContentfulGraphqlModule from '@/composables/contentful/useContentfulGraphql.js';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const themes = [{ name: 'art', identifier: 'art', primaryImageOfPage: {
  image: { url: 'https://images.ctfassets.net/example.jpg' }
} }];
const themesContentfulResponse = { data: { data: { themePageCollection: { items: themes } } } };

const themesAfterFetch = [{
  prefLabel: 'art',
  primaryImageOfPage: {
    image: {
      url: 'https://images.ctfassets.net/example.jpg'
    }
  },
  url: {
    name: 'themes-all',
    params: {
      pathMatch: 'art'
    }
  }
}];

const props = { title: 'themes' };

const contentfulQueryStub = sinon.stub();
contentfulQueryStub.resolves(themesContentfulResponse);

const factory = ({ propsData = props, mocks } = {}) => {
  return shallowMountNuxt(ThemeBadges, {
    localVue,
    propsData,
    mocks: {
      $i18n: {
        locale: 'de',
        localeProperties: { iso: 'de-DE' }
      },
      $t: () => {},
      localePath: (path) => `/${path.params?.pathMatch || ''}`,
      $route: { query: { mode: null } },
      $store: {
        commit: sinon.spy()
      },
      $matomo: {
        trackEvent: sinon.spy()
      },
      ...mocks
    },
    stubs: ['LinkBadge']
  });
};

describe('components/related/ThemeBadges', () => {
  beforeAll(() => {
    sinon.stub(useContentfulGraphqlModule, 'useContentfulGraphql').returns({
      query: contentfulQueryStub
    })
  });
  afterEach(sinon.resetHistory);
  afterAll(sinon.restore);

  describe('template', () => {
    describe('when themes are present', () => {
      it('shows a section with related collections chips', async() => {
        const wrapper = factory({ propsData: { ...props, themes } });

        const section = wrapper.find('[data-qa="related themes"]');
        expect(section.isVisible()).toBe(true);
      });
    });

    describe('when no themes are supplied', () => {
      describe('and no theme id\'s are supplied', () => {
        it('is not rendered', () => {
          const wrapper = factory();

          const relatedCollections = wrapper.find('[data-qa="related themes"]');
          expect(relatedCollections.exists()).toBe(false);
        });
      });
    });
  });

  describe('fetch', () => {
    describe('when theme id\'s are supplied', () => {
      it('fetches corresponding themes data', async() => {
        const wrapper = factory({ propsData: { ...props, themesIdentifiers: ['art'] } });

        await wrapper.vm.fetch();

        expect(wrapper.vm.themesData).toEqual(themesAfterFetch);
      });
    });
  });

  describe('clickEventHandler', () => {
    it('sets the loggable interaction state', () => {
      const wrapper = factory();

      wrapper.vm.clickEventHandler();

      expect(wrapper.vm.$store.commit.calledWith('search/setLoggableInteraction', true)).toBe(true);
    });
  });
});
