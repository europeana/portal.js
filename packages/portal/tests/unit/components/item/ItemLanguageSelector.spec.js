import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import ItemLanguageSelector from '@/components/item/ItemLanguageSelector';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData = {}) => mount(ItemLanguageSelector, {
  localVue,
  attachTo: document.body,
  propsData,
  mocks: {
    $auth: { loggedIn: propsData.loggedIn || false },
    localePath: () => {},
    $i18n: {
      locale: 'en',
      locales: [
        { code: 'en', name: 'English', iso: 'en-GB' },
        { code: 'de', name: 'Deutsch', iso: 'de-DE' },
        { code: 'nl', name: 'Nederlands', iso: 'nl-NL' }
      ]
    },
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
        lang: propsData.translationLanguage
      }
    }
  },
  stubs: ['NuxtLink', 'i18n']
});

describe('components/item/ItemLanguageSelector', () => {
  describe('when not logged in', () => {
    it('suggests to log in to enable the translation feature', () => {
      const wrapper = factory();

      const suggestion = wrapper.find('[data-qa="translate item login suggestion"]');

      expect(suggestion.exists()).toBe(true);
    });
  });
  describe('when logged in', () => {
    describe('when no translations are applied', () => {
      it('suggests to translate the item metadata to other languages', () => {
        const wrapper = factory({ loggedIn: true });

        const suggestion = wrapper.find('[data-qa="translate item suggestion"]');

        expect(suggestion.exists()).toBe(true);
        expect(wrapper.findAll('[data-qa="remove item translation button"]').exists()).toBe(false);
      });
    });
    describe('when tanslations are requested to a language other than the UI language', () => {
      it('suggests to translate the item metadata to other languages and offers to remove translations', () => {
        const wrapper = factory({ translationLanguage: 'de', loggedIn: true });

        const suggestion = wrapper.find('[data-qa="translate item suggestion"]');
        const removeButton = wrapper.find('[data-qa="remove item translation button"]');

        expect(suggestion.exists()).toBe(true);
        expect(removeButton.exists()).toBe(true);
      });
    });
    describe('when tanslations are requested to the UI language', () => {
      it('suggests to translate the item metadata to other languages and offers to remove translations', () => {
        const wrapper = factory({ translationLanguage: 'en', loggedIn: true  });

        const suggestion = wrapper.find('[data-qa="translate item suggestion"]');
        const removeButton = wrapper.find('[data-qa="remove item translation button"]');

        expect(suggestion.exists()).toBe(true);
        expect(removeButton.exists()).toBe(true);
      });
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

      expect(suggestion.exists()).toBe(true);
      expect(wrapper.findAll('[data-qa="translate item suggestion"]').exists()).toBe(false);
      expect(wrapper.findAll('[data-qa="remove item translation button"]').exists()).toBe(false);
    });
  });
  describe('when close button is clicked', () => {
    it('emits the hidden event', () => {
      const wrapper = factory();
      const button = wrapper.find('[data-qa="item language selector close button"]');
      button.trigger('click');

      expect(wrapper.emitted('hidden').length).toBe(1);
    });
  });
});
