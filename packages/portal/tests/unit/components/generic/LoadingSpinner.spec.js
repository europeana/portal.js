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

  it('uses the fallback message when none has been passed', () => {
    const wrapper = factory();

    const spinner =  wrapper.find('[data-qa="loading spinner"]');

    expect(spinner.text()).toBe('loading');
  });

  describe('delay', () => {
    it('prevents the spinner showing immediately', async() => {
      const wrapper = factory({ propsData: { delay: 500 } });

      const spinner = wrapper.find('[data-qa="loading spinner"]');
      await wrapper.vm.$nextTick();

      expect(spinner.isVisible()).toBe(false);
    });

    it('shows the spinner after delay has elapsed', async() => {
      const wrapper = factory({ propsData: { delay: 500 } });

      const spinner = wrapper.find('[data-qa="loading spinner"]');
      jest.runAllTimers();
      await wrapper.vm.$nextTick();

      expect(spinner.isVisible()).toBe(true);
    });
  });
});
