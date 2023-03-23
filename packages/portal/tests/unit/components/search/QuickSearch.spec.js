import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import QuickSearch from '@/components/search/QuickSearch.vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const themesOrOptions = [{ prefLabel: { en: 'theme1' } }, { prefLabel: { en: 'theme2' } }];

const factory = ({ propsData = {} } = {}) => shallowMountNuxt(QuickSearch, {
  localVue,
  propsData,
  mocks: {
    $contentful: {
      query: sinon.stub().resolves({ data: { data: { themePageCollection: { items: themesOrOptions } } } })
    },
    $i18n: {
      isoLocale: () => 'en-GB',
      locale: 'en'
    },
    $path: () => {},
    $route: {
      query: {}
    },
    $t: (key) => key
  }
});

describe('components/search/QuickSearch', () => {
  it('fetches all themes', async() => {
    const wrapper = factory();

    await wrapper.vm.fetch();

    expect(wrapper.vm.$contentful.query.called).toBe(true);
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
