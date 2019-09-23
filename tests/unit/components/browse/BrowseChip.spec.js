import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import BrowseChip from '../../../../components/browse/BrowseChip.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(BrowseChip, {
  localVue,
  mocks: {
    $route: () => {},
    $t: () => {},
    $i18n: () => {},
    localePath: () => {}
  },
  propsData: {
    linkTo: '/entity/topic/47-painting',
    title: 'Painting'
  }
});

describe('components/browse/BrowseChip', () => {
  it('shows chips for related entities', () => {
    const wrapper = factory();
    wrapper.findAll('[data-qa="browse chip"]').length.should.eq(1);
  });

  it('has an entity title and link', () => {
    const wrapper = factory();
    wrapper.setProps({ linkTo: '/entity/topic/47-painting', title: 'Painting' });

    const chip = wrapper.find('[data-qa="browse chip"]');
    chip.text().should.eq('Painting');
    chip.attributes().to.should.contain('47-painting');
  });
});
