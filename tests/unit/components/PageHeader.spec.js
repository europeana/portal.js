import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import PageHeader from '../../../components/PageHeader.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const $i18n = {
  locales: [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' }
  ],
  locale: 'en'
};

const factory = () => mount(PageHeader, {
  localVue,
  mocks: {
    $t: () => {},
    $i18n,
    $route: () => {},
    switchLocalePath: (code) => `path to ${code}`
  }
});

describe('components/search/PageHeader', () => {
  it('contains a search form', () => {
    const wrapper = factory();
    const form =  wrapper.find('[data-qa="search form"]');

    form.isVisible().should.equal(true);
  });

  it('contains the logo', () => {
    const wrapper = factory();

    const logo = wrapper.find('[data-qa="logo"]');
    logo.attributes().src.should.match(/\/logo\..+\.svg$/);
  });

  describe('when the language selector is enabled', () => {
    it('contains a language selector', () => {
      const wrapper = factory();
      wrapper.setProps({ langSelectEnabled: true });
      const selector = wrapper.find('[data-qa="language selector"]');
      selector.isVisible().should.equal(true);
    });
  });

  describe('when the language selector is disabled', () => {
    it('does NOT contain a language selector', () => {
      const wrapper = factory();
      const selector = wrapper.find('[data-qa="language selector"]');
      selector.exists().should.equal(false);
    });
  });
});
