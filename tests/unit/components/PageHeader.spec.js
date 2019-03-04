import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import PageHeader from '../../../components/PageHeader.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(PageHeader, {
  localVue
});

describe('PageHeader', () => {
  it('contains a search form with a query field', () => {
    const wrapper = factory();

    const queryField =  wrapper.find('[data-qa="search query input"]');

    queryField.attributes().name.should.equal('query');
  });

  it('contains a search form submit button', () => {
    const wrapper = factory();

    const submitButton =  wrapper.find('[data-qa="search submit button"]');

    submitButton.attributes().type.should.equal('submit');
  });

  it('contains the logo', () => {
    const wrapper = factory();

    const logo = wrapper.find('[data-qa="header logo"]');

    logo.attributes().src.should.match(/\/logo\..+\.svg$/); // Wildcard for compiled asset digest.
  });
});
