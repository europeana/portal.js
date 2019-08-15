import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import LangSelector from '../../../components/generic/LanguageSelector.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const $i18n = {
  locales: [
    { code: 'en', name: 'English', iso: 'en-GB' },
    { code: 'de', name: 'Deutsch', iso: 'de-DE' }
  ],
  locale: 'en'
};

const factory = () => shallowMount(LangSelector, {
  localVue,
  mocks: {
    $t: () => {},
    $i18n,
    $route: () => {},
    switchLocalePath: (code) => `path to ${code}`
  }
});

describe('components/generic/LanguageSelector', () => {
  it('updates the `locale property` with the correct code when selecting from the dropdown', () => {

  });
});
