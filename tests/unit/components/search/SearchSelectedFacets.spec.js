import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import SearchSelectedFacets from '../../../../components/search/SearchSelectedFacets.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => mount(SearchSelectedFacets, {
  localVue
});

describe('components/search/SearchSelectedFacets', () => {
  it('has two selected facets', () => {
    const wrapper = factory();
    wrapper.setProps({ facets: { TYPE: ['Image', 'Video'] } });

    const selected =  wrapper.findAll('.badge');
    selected.length.should.eq(2);
  });
});
