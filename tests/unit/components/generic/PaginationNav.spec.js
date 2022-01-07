import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import PaginationNav from '@/components/generic/PaginationNav.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(PaginationNav, {
  localVue
});

describe('components/generic/PaginationNav', () => {
  it('shows pagination for number of pages', async() => {
    const wrapper = factory();
    await wrapper.setProps({ totalResults: 240, perPage: 24 });

    expect(wrapper.attributes().numberofpages).toBe('10');
  });

  describe('if maxResults is 1000', () => {
    it('limits pagination to 1000 results', async() => {
      const wrapper = factory();
      await wrapper.setProps({ maxResults: 1000, totalResults: 123456, perPage: 24 });

      expect(wrapper.attributes().numberofpages).toBe('42');
    });
  });
});
