import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import PageHeader from '../../../components/PageHeader.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(PageHeader, {
  localVue,
  mocks: {
    $t: () => {},
    $route: () => {}
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

  it('contains a language selector', () => {
    const wrapper = factory();
    const selector = wrapper.find('[data-qa="language selector"]');

    selector.isVisible().should.equal(true);
  });

});
