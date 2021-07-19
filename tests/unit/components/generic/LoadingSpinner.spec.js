import { shallowMount } from '@vue/test-utils';
import LoadingSpinner from '@/components/generic/LoadingSpinner.vue';

const factory = () => shallowMount(LoadingSpinner);

describe('components/generic/LoadingSpinner', () => {
  it('exists', () => {
    const wrapper = factory();

    const spinner =  wrapper.find('[data-qa="loading spinner"]');
    spinner.attributes().class.should.contain('spinner-border');
  });
});
