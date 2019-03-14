import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import SearchFacets from '../../../../components/search/SearchFacets.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => mount(SearchFacets, {
  localVue
});

const options = { 'TYPE': { 'TEXT': 123456, 'VIDEO': 567 } };

describe('components/search/SearchFacets', () => {
  it('has the text `Type of media` in the header', () => {
    const wrapper = factory();
    wrapper.setProps({ options: options });

    const facetHeader =  wrapper.find('[data-qa="search facets"] .card-header');
    facetHeader.text().should.eq('Type of media');
  });

  it('has two checkboxes', () => {
    const wrapper = factory();
    wrapper.setProps({ options: options });

    const facets =  wrapper.find('[data-qa="search facets"]').findAll('input[type="checkbox"]');
    facets.length.should.eq(2);
  });

  it('has a selected checkbox', () => {
    const wrapper = factory();
    wrapper.setProps({ options: options });

    const facets =  wrapper.find('[data-qa="search facets"]').findAll('input[type="checkbox"]');
    const firstSelected = facets.at(1);
    firstSelected.setChecked();

    wrapper.vm.selected[0].should.eq('VIDEO');
  });
});
