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

const computed = {
  langSelectEnabled() {
    return true;
  }
};

const factory = () => mount(PageHeader, {
  localVue,
  mocks: {
    $t: () => {},
    $i18n,
    switchLocalePath: (code) => `path to ${code}`
  },
  computed: computed
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

  describe('when ENV enables the language selector', () => {
    describe('it contains a language selector', () => {
      const wrapper = factory();
      const selector = wrapper.find('[data-qa="language selector"]');
      selector.isVisible().should.equal(true);
    });
  });
});
