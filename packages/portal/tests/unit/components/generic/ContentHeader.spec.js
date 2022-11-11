import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import ContentHeader from '@/components/generic/ContentHeader.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const $i18n = {
  locale: 'en'
};

const factory = (propsData = {}) => mount(ContentHeader, {
  localVue,
  propsData,
  mocks: {
    $config: { app: { internalLinkDomain: null } },
    $t: (val) => val,
    $i18n,
    $path: () => '/',
    $store: {
      state: {
        pageMeta: {
          data: {
            title: 'stored title'
          }
        }
      }
    }
  }
});

const details = {
  title: 'This is a page',
  contextLabel: 'This is a label'
};

describe('components/generic/ContentHeader', () => {
  describe('template', () => {
    it('shows the page title in an h1', () => {
      const wrapper = factory(details);

      expect(wrapper.find('h1[data-qa="page title"]').text()).toBe(details.title);
    });

    it('falls back to the pageMeta store if no title supplied', () => {
      const wrapper = factory();

      expect(wrapper.find('h1[data-qa="page title"]').text()).toBe('stored title');
    });

    it('shows a label', () => {
      const wrapper = factory(details);

      expect(wrapper.find('[data-qa="context label"]').text()).toBe(details.contextLabel);
    });
  });
});
