import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import ItemLanguageSelector from '@/components/item/ItemLanguageSelector';
import VueI18n from 'vue-i18n';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(VueI18n);

import messages from '@/lang/en';

const i18n = new VueI18n({
  locale: 'en',
  messages: {
    en: messages
  }
});
i18n.locales = [
  { code: 'en', name: 'English', iso: 'en-GB' },
  { code: 'de', name: 'Deutsch', iso: 'de-DE' },
  { code: 'nl', name: 'Nederlands', iso: 'nl-NL' }
];

const factory = (propsData = {}) => mount(ItemLanguageSelector, {
  localVue,
  propsData,
  i18n,
  mocks: {
    $t: (key) => {
      if (key === 'multilingual.differentLanguage') {
        return 'a different language';
      } else if (key === 'multilingual.originalLanguage') {
        return 'original language';
      } else {
        return '';
      }
    },
    $route: {
      path: 'item/example/123',
      query: {
        lang: propsData.metadataLanguage
      }
    }
  },
  stubs: {
    NuxtLink: true
  }
});

describe('components/item/ItemLanguageSelector', () => {
  describe('when no translations are applied', () => {
    it('suggests to translate the item metadata to other languages', () => {
      const wrapper = factory();

      const suggestion = wrapper.find('[data-qa="translate item suggestion"]');
      expect(suggestion.text()).toContain('Would you like to see this item in');

      expect(wrapper.findAll('[data-qa="remove item translation button"]').exists()).toBe(false);
    });
  });
  describe('when tanslations are requested to a language other than the UI language', () => {
    it('suggests to translate the item metadata to other languages and offers to remove translations', () => {
      const wrapper = factory({ metadataLanguage: 'de' });

      const suggestion = wrapper.find('[data-qa="translate item suggestion"]');
      const removeButton = wrapper.find('[data-qa="remove item translation button"]');
      expect(suggestion.text()).toContain('Would you like to see this item in');
      expect(removeButton.text()).toBe('Stop translating this item to Deutsch.');
    });
  });
  describe('when tanslations are requested to the UI language', () => {
    it('suggests to translate the item metadata to other languages and offers to remove translations', () => {
      const wrapper = factory({ metadataLanguage: 'en'  });

      const suggestion = wrapper.find('[data-qa="translate item suggestion"]');
      const removeButton = wrapper.find('[data-qa="remove item translation button"]');
      expect(suggestion.text()).toContain('Would you like to see this item in');
      expect(removeButton.text()).toBe('Stop translating this item to English.');
    });
  });

  describe('translateParams', () => {
    it('adds the lang query with the provided language code', () => {
      const wrapper = factory();
      const newParams = wrapper.vm.translateParams('de');
      expect(newParams.query.lang).toBe('de');
    });
  });

  describe('when the recuested translation failed', () => {
    it('shows an error message', () => {
      const wrapper = factory({ fromTranslationError: true });

      const suggestion = wrapper.find('[data-qa="translate item error"]');
      expect(suggestion.text()).toContain('Translation service is temporarily unavailable. Please try again later.');

      expect(wrapper.findAll('[data-qa="translate item suggestion"]').exists()).toBe(false);
      expect(wrapper.findAll('[data-qa="remove item translation button"]').exists()).toBe(false);
    });
  });
});
