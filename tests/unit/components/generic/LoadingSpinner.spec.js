import { shallowMount } from '@vue/test-utils';
import LoadingSpinner from '@/components/generic/LoadingSpinner.vue';

const factory = () => shallowMount(LoadingSpinner, {
  mocks: {
    $t: (key) => key
  }
});

describe('components/generic/LoadingSpinner', () => {
  it('uses the fallback message when none has been passed', () => {
    const wrapper = factory();

    const spinner =  wrapper.find('[data-qa="loading spinner"]');
    expect(spinner.text()).toBe('loading');
  });
});
