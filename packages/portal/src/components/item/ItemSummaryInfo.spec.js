import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import ItemSummaryInfo from '@/components/item/ItemSummaryInfo.vue';
import VueI18n from 'vue-i18n';

const localVue = createLocalVue();
localVue.filter('truncate', (val) => {
  return val.length > 20 ? val.substring(0, 20) + '...' : val;
});

localVue.use(BootstrapVue);
localVue.use(VueI18n);

const i18n = new VueI18n({
  locale: 'en',
  messages: {
    en: {
      formatting: {
        ellipsis: '…'
      }
    }
  }
});

const factory = (propsData, translated = false) => mount(ItemSummaryInfo, {
  localVue,
  attachTo: document.body,
  propsData,
  i18n,
  mocks: {
    $t: (key) => `TRANSLATED: ${key}`,
    $route: {},
    $features: {
      translatedItems: translated
    }
  },
  provide: {
    deBias: {
      definitions: {},
      terms: {}
    }
  }
});

describe('components/item/ItemSummaryInfo', () => {
  describe('displaying summary info', () => {
    const wrapper = factory({
      titles: [
        { code: 'en', value: 'The title' },
        { code: 'en', value: 'The sub-title' }
      ],
      description: { code: 'en', values: ['The description'] }
    });

    it('shows a title', () => {
      const title = wrapper.find('h1');

      expect(title.text()).toBe('The title');
    });
    it('shows a sub-title', () => {
      const subTitle = wrapper.find('header p');

      expect(subTitle.text()).toBe('The sub-title');
    });
    it('shows a description', () => {
      const description = wrapper.find('div.description p');

      expect(description.text()).toBe('The description');
    });
  });

  describe('when there are multiple descriptions', () => {
    const wrapper = factory({
      titles: [{ code: 'en', value: 'The title' }],
      description: {
        code: 'en',
        values: ['The description', 'another description']
      }
    });

    it('shows a read more button', () => {
      const readMoreToggle = wrapper.find('button[data-qa="description show link"]');
      expect(readMoreToggle.text()).toBe('TRANSLATED: actions.readMore');
    });
  });

  describe('when there is a long description', () => {
    const wrapper = factory({
      titles: [{ code: 'en', value: 'The title' }],
      description: {
        code: 'en',
        values: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.']
      }
    });

    it('shows a title', () => {
      const readMoreToggle = wrapper.find('button[data-qa="description show link"]');
      expect(readMoreToggle.text()).toBe('TRANSLATED: actions.readMore');
    });
  });

  describe('when the item is translated', () => {
    const wrapper = factory({
      titles: [
        { code: 'en', value: 'The title', translationSource: 'automated' },
        { code: 'en', value: 'The sub-title' }
      ],
      description: { code: 'en', values: ['The description'], translationSource: 'automated' }
    }, true);
    it('there is an icon behind the title signifying the translation source', () => {
      const tooltip = wrapper.find('h1 [data-qa="translation tooltip"]');
      expect(tooltip.isVisible()).toBe(true);
    });
    it('there is an icon behind the description signifying the translation source', () => {
      const tooltip = wrapper.find('div.description [data-qa="translation tooltip"]');
      expect(tooltip.isVisible()).toBe(true);
    });
  });
});
