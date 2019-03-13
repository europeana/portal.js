import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import SearchFacet from '../../../../components/search/SearchFacet.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => mount(SearchFacet, {
  localVue
});

const facetName = 'TYPE';
const facetFields = { 'TEXT': 123456, 'VIDEO': 567 };

describe('components/search/SearchFacet', () => {
  it('has the text `TYPE` in the header', () => {
    const wrapper = factory();
    wrapper.setProps({ name: facetName, fields: facetFields });

    const facetHeader =  wrapper.find('[data-qa="search facet"] .card-header');
    facetHeader.text().should.eq('TYPE');
  });

  it('has two checkboxes', () => {
    const wrapper = factory();
    wrapper.setProps({ name: facetName, fields: facetFields });

    const facets =  wrapper.find('[data-qa="search facet"]').findAll('input[type="checkbox"]');
    facets.length.should.eq(2);
  });

  it('emits `selected` event when selected', () => {
    const wrapper = factory();
    wrapper.setProps({ name: facetName, fields: facetFields });

    const facets =  wrapper.find('[data-qa="search facet"]').findAll('input[type="checkbox"]');
    const firstFacet = facets.at(1);
    firstFacet.setChecked();

    wrapper.emitted()['selected'][0][0].should.eql('TYPE', ['VIDEO']);
  });
});
