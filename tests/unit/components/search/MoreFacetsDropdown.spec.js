import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import MoreFacetsDropdown from '../../../../components/search/MoreFacetsDropdown.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(MoreFacetsDropdown, {
  localVue,
  mocks: {
    $t: (key) => key
  }
});

describe('components/search/MoreFacetsDropdown', () => {
  it('displays the correct number of saved options', () => {
    const wrapper = factory();

    wrapper.setData({
      saved: {
        LANGUAGE: ['de', 'sv'],
        PROVIDER: ['OpenUp!']
      }
    });

    wrapper.vm.savedOptions.length.should.eql(3);
  });
});
