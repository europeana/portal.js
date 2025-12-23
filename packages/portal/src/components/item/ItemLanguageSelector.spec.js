import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import ItemLanguageSelector from '@/components/item/ItemLanguageSelector';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = ({ propsData = {}, mocks = {} } = {}) => mount(ItemLanguageSelector, {
  localVue,
  propsData,
  mocks: {
    $auth: { loggedIn: mocks.loggedIn || false },
    localePath: () => {},
    $i18n: {
      locale: 'en',
      locales: [
        { code: 'en', name: 'English', iso: 'en-GB' },
        { code: 'de', name: 'Deutsch', iso: 'de-DE' },
        { code: 'nl', name: 'Nederlands', iso: 'nl-NL' }
      ]
    },
    $keycloak: {
      login: sinon.spy()
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
        lang: mocks.translationLanguage
      }
    }
  },
  stubs: ['i18n']
});

describe('components/item/ItemLanguageSelector', () => {
  describe('when item metadata is not translated', () => {
    it('suggests to translate the item', () => {
      const wrapper = factory();

      const suggestion = wrapper.find('[data-qa="item language selector toggle text suggestion"]');

      expect(suggestion.exists()).toBe(true);
      expect(wrapper.findAll('[data-qa="item language selector toggle text translated"]').exists()).toBe(false);
    });
  });

  describe('when item metadata is translated', () => {
    it('the first option in the dropdown is to remove translations', () => {
      const wrapper = factory({ propsData: { translationLanguage: 'de' }, mocks: { loggedIn: true } });

      const removeButton = wrapper.find('[data-qa="remove item translation button"]');

      expect(removeButton.exists()).toBe(true);
    });
  });

  describe('translateParams', () => {
    it('adds the lang query with the provided language code', () => {
      const wrapper = factory();
      const newParams = wrapper.vm.translateParams('de');

      expect(newParams.query.lang).toBe('de');
    });
  });

  describe('when clicking a language option', () => {
    describe('when not logged in', () => {
      it('redirects to login', async() => {
        const wrapper = factory();

        wrapper.find('[data-qa="item language option nl"]').trigger('click');

        expect(wrapper.vm.$keycloak.login.called).toBe(true);
      });
    });
  });

  describe('when the requested translation failed', () => {
    it('shows an error message', () => {
      const wrapper = factory({ propsData: { fromTranslationError: true } });

      const suggestion = wrapper.find('[data-qa="translate item error"]');

      expect(suggestion.exists()).toBe(true);
      expect(wrapper.findAll('[data-qa="translate item suggestion"]').exists()).toBe(false);
      expect(wrapper.findAll('[data-qa="remove item translation button"]').exists()).toBe(false);
    });
  });
});
