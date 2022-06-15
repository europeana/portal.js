import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import PaginationNavInput from '@/components/generic/PaginationNavInput.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (options = {}) => shallowMount(PaginationNavInput, {
  localVue,
  mocks: {
    ...{
      $t: () => {},
      $route: { query: { page: 1 } }
    }, ...(options.mocks || {})
  }
});

describe('components/generic/PaginationNavInput', () => {
  it('shows pagination for number of pages', async() => {
    const wrapper = factory();
    await wrapper.setProps({ totalResults: 240, perPage: 24 });

    expect(wrapper.vm.totalPages).toBe(10);
  });

  it('disables the previous button on first page', async() => {
    const wrapper = factory();
    await wrapper.setProps({ totalResults: 240, perPage: 24 });

    const prevButton =  wrapper.find('[data-qa="prev button"]');
    expect(prevButton.attributes().class).toContain('disabled');
  });

  it('disables the next button on last page', async() => {
    const wrapper = factory({
      mocks: {
        $route: {
          query: {
            page: 10
          }
        }
      }
    });
    await wrapper.setProps({ totalResults: 240, perPage: 24 });

    const nextButton =  wrapper.find('[data-qa="next button"]');
    expect(nextButton.attributes().class).toContain('disabled');
  });
});
