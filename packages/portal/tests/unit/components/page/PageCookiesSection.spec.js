import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import PageCookiesSection from '@/components/page/PageCookiesSection';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const bookWidgetServiceData = {
  name: 'bookWidgets',
  purposes: ['thirdPartyContent', 'mediaViewing', '2D']
};

const structuredServiceData = {
  name: 'thirdPartyContent',
  services: [
    {
      name: 'mediaViewing',
      services: [
        {
          name: '2D',
          services: [
            bookWidgetServiceData
          ]
        }
      ]
    }
  ]
};

const factory = (propsData) => shallowMount(PageCookiesSection, {
  localVue,
  propsData,
  mocks: {
    $t: (key) => key,
    $tc: (key) => key,
    $te: () => true,
    $n: (num) =>  num,
    $i18n: {
      fallbackLocale: 'en'
    }
  }
});

describe('components/page/PageCookiesSection', () => {
  beforeEach(() => {
    sinon.resetHistory();
  });
  describe('when the section is aggregating other sections', () => {
    it('renders a checkbox with corresponding label and description', () => {
      const wrapper = factory({ serviceData: structuredServiceData });
      const checkbox = wrapper.find('b-form-checkbox-stub');
      const description = wrapper.find(`#${checkbox.attributes('aria-describedby')}`);

      expect(checkbox.text()).toContain('klaro.main.purposes.thirdPartyContent.title');
      expect(description.isVisible()).toBe(true);
    });
  });

  describe('when the section is an individual service', () => {
    it('renders a checkbox with corresponding label', () => {
      const wrapper = factory({ serviceData: bookWidgetServiceData });
      const checkbox = wrapper.find('b-form-checkbox-stub');
      const description = wrapper.find(`#${checkbox.attributes('aria-describedby')}`);

      expect(checkbox.text()).toContain('klaro.services.bookWidgets.title');
      expect(description.isVisible()).toBe(true);
    });
  });

  describe('clicking the services display button', () => {
    it('emits the toggle event', () => {
      const wrapper = factory({ serviceData: structuredServiceData, show: ['thirdPartyContent'] });

      wrapper.find('b-button-stub').trigger('click');
      expect(wrapper.emitted('toggle').length).toBe(1);
      expect(wrapper.emitted('toggle')[0]).toEqual(['thirdPartyContent']);
    });
  });

  describe('updateConsent', () => {
    describe('when called for a specific service', () => {
      it('emits the update event for all contained services', () => {
        const serviceData = {
          cookies: ['auth.stratgey'],
          name: 'auth-strategy',
          required: true,
          purposes: ['essential']
        };

        const wrapper = factory({ serviceData });

        wrapper.vm.updateConsent(serviceData, true);

        expect(wrapper.emitted('update').length).toBe(1);
        expect(wrapper.emitted('update')[0][0].name).toBe('auth-strategy');
        expect(wrapper.emitted('update')[0][1]).toBe(true);
      });
    });

    describe('when the service is aggregating multiple services', () => {
      it('emits the update event for all contained services', () => {
        const serviceData = {
          name: 'essential',
          required: true,
          services: [
            {
              cookies: ['auth.strategy'],
              name: 'auth-strategy',
              purposes: ['essential'],
              required: true
            },
            {
              cookies: ['debugSettings'],
              name: 'debugSettings',
              purposes: ['essential'],
              required: true
            }
          ]
        };

        const wrapper = factory({ serviceData });

        wrapper.vm.updateConsent(serviceData, false);

        expect(wrapper.emitted('update').length).toBe(3);
        expect(wrapper.emitted('update')[0][0].name).toBe('auth-strategy');
        expect(wrapper.emitted('update')[0][1]).toBe(false);
        expect(wrapper.emitted('update')[1][0].name).toBe('debugSettings');
        expect(wrapper.emitted('update')[1][1]).toBe(false);
        expect(wrapper.emitted('update')[2][0].name).toBe('essential');
        expect(wrapper.emitted('update')[2][1]).toBe(false);
      });
    });
  });
});
