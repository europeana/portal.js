import { createLocalVue, shallowMount } from '@vue/test-utils';
import PageCookiesCheckbox from '@/components/page/PageCookiesCheckbox';

const localVue = createLocalVue();

const factory = (propsData) => shallowMount(PageCookiesCheckbox, {
  localVue,
  propsData,
  mocks: {
    $t: (key) => key
  },
  stubs: ['b-form-checkbox']
});

describe('components/page/PageCookiesCheckbox', () => {
  describe('when type is purpose', () => {
    it('renders a checkbox with corresponding label', () => {
      const purposeName =  'essential';
      const wrapper = factory({ serviceOrPurpose: { name: purposeName }, type: 'purpose' });
      const checkbox = wrapper.find('b-form-checkbox-stub');

      expect(checkbox.text()).toEqual(`klaro.main.purposes.${purposeName}.title`);
    });
  });

  describe('when type is service', () => {
    it('renders a checkbox with corresponding label', () => {
      const serviceName =  'matomo';
      const wrapper = factory({ serviceOrPurpose: { name: serviceName } });
      const checkbox = wrapper.find('b-form-checkbox-stub');

      expect(checkbox.text()).toEqual(`klaro.services.${serviceName}.title`);
    });
  });
});
