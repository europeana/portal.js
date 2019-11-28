import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import MoreFacetsDropdownOptions from '../../../../components/search/MoreFacetsDropdownOptions.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => mount(MoreFacetsDropdownOptions, {
  localVue,
  mocks: {
    $t: (key) => key,
    $tc: (key) => key,
    $te: () => true
  },
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

describe('components/search/MoreFacetsDropdownOptions', () => {
  it('emits `selectedOptions` event when selected method is called', () => {
    const wrapper = factory();
    const checkbox = wrapper.find('[data-qa="de checkbox"]');

    wrapper.setData({ limitTo: 9 });

    checkbox.trigger('click');
    wrapper.emitted()['selectedOptions'].should.eql([ [ 'LANGUAGE', [ 'de' ] ] ]);
  });

  it('localiseFilterLabel() returns correct label', () => {
    const wrapper = factory();
    const label = '#000000';

    wrapper.setProps({ name: 'COLOURPALETTE' });

    wrapper.vm.localiseFilterLabel(label).should.eq('facets.COLOURPALETTE.options.#000000');
  });
});
