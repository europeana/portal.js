import { shallowMount } from '@vue/test-utils';
import PageFooter from '../../../components/PageFooter.vue';

const factory = () => shallowMount(PageFooter, {
  mocks: {
    $t: () => {}
  }
});

describe('components/search/PageFooter', () => {
  it('it exists', () => {
    const wrapper = factory();

    const footer = wrapper.find('footer');
    footer.isVisible().should.equal(true);
  });
});
