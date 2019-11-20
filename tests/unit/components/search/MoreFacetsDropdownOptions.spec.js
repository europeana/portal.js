import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import MoreFacetsDropdownOptions from '../../../../components/search/MoreFacetsDropdownOptions.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => mount(MoreFacetsDropdownOptions, {
  localVue,
  mocks: {
    $t: (key) => key,
    $tc: (key) => key
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
  it('emits `selectedOptions` event when selected method is called', async() => {
    const wrapper = factory();
    const checkbox = wrapper.find('[data-qa="facets.LANGUAGE.name de checkbox"]');

    console.log('poo', wrapper.html());

    wrapper.setData({ limitTo: 9 });

    checkbox.trigger('click');
    wrapper.emitted()['selectedOptions'].should.eql([ [ 'LANGUAGE', [ 'de' ] ] ]);
  });
});
