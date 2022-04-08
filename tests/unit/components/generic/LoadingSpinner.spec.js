import { shallowMount } from '@vue/test-utils';
import LoadingSpinner from '@/components/generic/LoadingSpinner.vue';

const factory = () => shallowMount(LoadingSpinner);

describe('components/generic/LoadingSpinner', () => {
  it('exists', () => {
    const wrapper = factory();

    const spinner =  wrapper.find('[data-qa="loading spinner"]');
    expect(spinner.attributes().class).toContain('spinner-border');
  });
});
