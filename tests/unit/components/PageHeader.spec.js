import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import PageHeader from '../../../components/PageHeader.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(PageHeader, {
  localVue,
  mocks: {
    $t: () => {},
    localePath: (code) => window.location.href + code
  }
});

describe('components/PageHeader', () => {
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

  describe('language selector', () => {
    context('by default', () => {
      it('is disabled', () => {
        const wrapper = factory();
        const selector = wrapper.find('[data-qa="language selector"]');

        selector.exists().should.be.false;
      });
    });

    context('when feature is toggled on', () => {
      it('is displayed', () => {
        const wrapper = factory();
        wrapper.setProps({
          enableLanguageSelector: true
        });
        const selector = wrapper.find('[data-qa="language selector"]');

        selector.isVisible().should.equal(true);
      });
    });
  });
});
