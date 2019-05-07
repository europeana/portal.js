import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import SearchFacet from '../../../../components/search/SearchFacet.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => mount(SearchFacet, {
  localVue,
  mocks: {
    $t: (key) => key
  }
});

const facetName = 'TYPE';
const facetFields = [
  { label: 'TEXT', count: 123456 },
  { label: 'VIDEO', count: 567 }
];

describe('components/search/SearchFacet', () => {
  it('has the translated facet label in the header', () => {
    const wrapper = factory();
    wrapper.setProps({ name: facetName, fields: facetFields });

    const facetHeader =  wrapper.find('[data-qa="search facet"] .card-header');
    facetHeader.text().should.eq('facets.TYPE');
  });

  it('has a checkbox for each field', () => {
    const wrapper = factory();
    wrapper.setProps({ name: facetName, fields: facetFields });

    const facets =  wrapper.find('[data-qa="search facet"]').findAll('input[type="checkbox"]');
    facets.length.should.eq(facetFields.length);
  });

  it('keeps facet name in `data-facet-name`', () => {
    const wrapper = factory();
    wrapper.setProps({ name: facetName, fields: facetFields });

    const facetContainer =  wrapper.find('[data-qa="search facet"]');
    facetContainer.attributes('data-facet-name').should.eq(facetName);
  });

  it('emits `changed` event when selected', () => {
    const wrapper = factory();
    wrapper.setProps({ name: facetName, fields: facetFields });

    const facets =  wrapper.find('[data-qa="search facet"]').findAll('input[type="checkbox"]');
    const firstFacet = facets.at(1);
    firstFacet.setChecked();

    wrapper.emitted()['changed'][0][0].should.eql('TYPE', ['VIDEO']);
  });
});
