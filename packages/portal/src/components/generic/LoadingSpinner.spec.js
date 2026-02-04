import { shallowMount } from '@vue/test-utils';
import LoadingSpinner from '@/components/generic/LoadingSpinner.vue';

const factory = ({ propsData } = {}) => shallowMount(LoadingSpinner, {
  propsData,
  mocks: {
    $t: (key) => key
  }
});

describe('components/generic/LoadingSpinner', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it('uses the fallback message when none has been passed', async() => {
    const wrapper = factory();
    jest.runAllTimers();
    await wrapper.vm.$nextTick();

    const spinner =  wrapper.find('[data-qa="loading spinner"]');

    expect(spinner.text()).toBe('loading');
  });

  describe('delay', () => {
    it('prevents the spinner rendering immediately', async() => {
      const wrapper = factory();

      const spinner = wrapper.find('[data-qa="loading spinner"]');

      expect(spinner.exists()).toBe(false);
    });

    it('shows the spinner after delay has elapsed', async() => {
      const wrapper = factory();
      jest.runAllTimers();
      await wrapper.vm.$nextTick();

      const spinner = wrapper.find('[data-qa="loading spinner"]');

      expect(spinner.isVisible()).toBe(true);
    });
  });
});
