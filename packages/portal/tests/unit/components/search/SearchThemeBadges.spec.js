import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import SearchThemeBadges from '@/components/search/SearchThemeBadges.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const themesOrOptions = [{ prefLabel: { en: 'theme1' } }, { prefLabel: { en: 'theme2' } }];
const themesOrOptionsContentfulResponse = { data: { data: { themePageCollection: { items: themesOrOptions } } } };
const contentfulQueryStub = sinon.stub();
contentfulQueryStub.resolves(themesOrOptionsContentfulResponse);

const factory = ({ propsData = {} } = {}) => shallowMountNuxt(SearchThemeBadges, {
  localVue,
  propsData,
  mocks: {
    $contentful: {
      query: contentfulQueryStub
    },
    $i18n: {
      localeProperties: { iso: 'en-GB' },
      locale: 'en'
    },
    localePath: () => {},
    $route: {
      query: {}
    },
    $t: (key) => key
  }
});

describe('components/search/SearchThemeBadges', () => {
  afterEach(sinon.resetHistory);
  afterAll(sinon.restore);

  it('fetches all themes', async() => {
    const wrapper = factory();

    await wrapper.vm.fetch();

    expect(contentfulQueryStub.called).toBe(true);
  });

  describe('when options are passed', () => {
    it('is rendered', () => {
      const wrapper = factory({ propsData: { options: themesOrOptions } });

      const quickSearch = wrapper.find('[data-qa="quick-search"]');

      expect(quickSearch.exists()).toBe(true);
    });
  });

  describe('when fetch returns themes', () => {
    it('is rendered', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      const quickSearch = wrapper.find('[data-qa="quick-search"]');

      expect(quickSearch.exists()).toBe(true);
    });
  });

  describe('when no options and no themes', () => {
    it('is empty', () => {
      const wrapper = factory();

      const quickSearch = wrapper.find('[data-qa="quick-search"]');

      expect(quickSearch.exists()).toBe(false);
    });
  });
});
