import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import QuickSearch from '@/components/search/QuickSearch.vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = ({ propsData = {} } = {}) => shallowMountNuxt(QuickSearch, {
  localVue,
  propsData,
  mocks: {
    $contentful: {
      query: sinon.stub().resolves({ data: { data: { themePageCollection: { items: [] } } } })
    },
    $i18n: {
      isoLocale: () => 'en-GB',
      locale: 'en'
    },
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

  describe('when options or themes are available', () => {
    it('is rendered', () => {
      const wrapper = factory({ propsData: { options: [{ prefLabel: { en: 'theme1' } }, { prefLabel: { en: 'theme2' } }] } });

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
