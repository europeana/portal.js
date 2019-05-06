import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import BrowseChip from '../../../../components/browse/BrowseChip.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(BrowseChip, {
  localVue
});

describe('components/browse/BrowseChip', () => {
  it('shows chips for related entities', () => {
    const wrapper = factory();
    wrapper.setProps({ entity: { link: 'http://europeana.eu', title: 'Architecture' } });

    wrapper.findAll('[data-qa="browse chip"]').length.should.eq(1);
  });

  it('has an entity title and link', () => {
    const wrapper = factory();
    wrapper.setProps({ entity: { link: 'http://europeana.eu', title: 'Architecture' } });

    const chip = wrapper.find('[data-qa="browse chip"]');

    chip.text().should.eq('Architecture');
    chip.attributes().to.should.eq('http://europeana.eu');
  });

  it('does not show chips if no related entities found', () => {
    const wrapper = factory();

    wrapper.findAll('[data-qa="browse chip"]').length.should.eq(0);
  });
});
