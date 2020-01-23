import { createLocalVue, shallowMount } from '@vue/test-utils';
import MoreFiltersDropdownFacet from '../../../../components/search/MoreFiltersDropdownFacet.vue';

const localVue = createLocalVue();

const factory = () => shallowMount(MoreFiltersDropdownFacet, {
  localVue,
  mocks: {
    $t: (key) => key,
    $tc: (key) => key,
    $store: { getters: {} }
  },
  stubs: ['b-form-checkbox-group', 'b-form-group'],
  propsData: {
    name: 'LANGUAGE',
    fields: [
      {
        label: 'de',
        count: 123
      },
      {
        label: 'sv',
        count: 12
      }
    ]
  }
});

describe('components/search/MoreFiltersDropdownFacet', () => {
  it('emits `selectedOptions` event when checkbox group changes', async() => {
    const wrapper = factory();
    const checkboxGroup = wrapper.find('[data-qa="checkbox group"]');

    wrapper.setData({ selectedOptions: ['de'] });
    await checkboxGroup.vm.$emit('change');
    await wrapper.vm.$nextTick();

    wrapper.emitted()['selectedOptions'].should.eql([ [ 'LANGUAGE', [ 'de' ] ] ]);
  });
});
