import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import LangSelector from '@/components/generic/LanguageSelector.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (locale, { mocks = {} } = {}) => mount(LangSelector, {
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
    localePath: sinon.stub().callsFake((route, code) => window.location.href + code),
    ...mocks
  }
});

describe('components/generic/LanguageSelector', () => {
  describe('Dropdown Items', () => {
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

  describe('Dropdown Button', () => {
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

  describe('methods', () => {
    describe('localeHref', () => {
      it('removes page route query param from stories page links', () => {
        const $route = { name: 'stories___en', query: { page: '2' } };
        const wrapper = factory('en', { mocks: { $route } });

        wrapper.vm.localeHref('de');

        expect(wrapper.vm.localePath.calledWith({ query: {} }, 'de')).toBe(true);
      });

      it('removes page route query param from galleries page links', () => {
        const $route = { name: 'galleries___en', query: { page: '2' } };
        const wrapper = factory('en', { mocks: { $route } });

        wrapper.vm.localeHref('de');

        expect(wrapper.vm.localePath.calledWith({ query: {} }, 'de')).toBe(true);
      });

      it('preserves page route query param on search page links', () => {
        const $route = { name: 'search___en', query: { page: '2' } };
        const wrapper = factory('en', { mocks: { $route } });

        wrapper.vm.localeHref('de');

        expect(wrapper.vm.localePath.calledWith({ query: { page: '2' } }, 'de')).toBe(true);
      });
    });
  });
});
