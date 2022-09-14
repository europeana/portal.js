import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import LangSelector from '@/components/generic/LanguageSelector.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (locale) => mount(LangSelector, {
  localVue,
  mocks: {
    $t: () => {},
    $i18n: {
      locales: [
        { code: 'en', name: 'English', iso: 'en-GB' },
        { code: 'de', name: 'Deutsch', iso: 'de-DE' }
      ],
      locale
    },
    $route: () => {},
    switchLocalePath: (code) => window.location.href + code
  }
});

describe('components/generic/LanguageSelector Dropdown Items', () => {
  describe('when the language is `en`', () => {
    it('only shows the German object as English is currently selected', () => {
      const wrapper = factory('en');

      expect(wrapper.vm.availableLocales[0].code).toBe('de');
    });
  });

  describe('when the language is `de`', () => {
    it('only shows the English object as German is currently selected', () => {
      const wrapper = factory('de');

      expect(wrapper.vm.availableLocales[0].code).toBe('en');
    });
  });
});

describe('components/generic/LanguageSelector Dropdown Button', () => {
  describe('when the language is `en`', () => {
    it('shows `English` as the selected state', () => {
      const wrapper = factory('en');

      expect(wrapper.vm.selectedLocale.name).toBe('English');
    });
  });

  describe('when the language is `de`', () => {
    it('shows `English` as the selected state', () => {
      const wrapper = factory('de');

      expect(wrapper.vm.selectedLocale.name).toBe('Deutsch');
    });
  });
});
