import { shallowMount } from '@vue/test-utils';
import PageFooter from '../../../components/PageFooter.vue';

const factory = () => shallowMount(PageFooter);

describe('components/search/PageFooter', () => {
  it('it exists', () => {
    const wrapper = factory();

    const footer = wrapper.find('footer');
    footer.exists().should.eq(true);
  });
});
