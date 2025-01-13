import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import PageCookiesSection from '@/components/page/PageCookiesSection';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const klaroServices = [
  {
    name: 'auth-strategy',
    purposes: ['essential'],
    required: true
  },
  {
    name: 'matomo',
    purposes: ['usage']
  },
  {
    name: 'facebook',
    purposes: ['thirdPartyContent', 'socialMedia']
  },
  {
    name: 'bookWidgets',
    purposes: ['thirdPartyContent', 'mediaViewing', '2D']
  }
];

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

const klaroConfig = { services: klaroServices };

const klaroManager = {
  updateConsent: sinon.spy(),
  config: klaroConfig
};

const factory = (propsData) => shallowMount(PageCookiesSection, {
  localVue,
  propsData,
  provide: {
    show: [],
    checkedServices: ['auth-strategy', 'debugSettings'],
    klaroManager
  },
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

      expect(checkbox.text()).toContain('klaro.main.purposes.thirdPartyContent.title');
      expect(checkbox.text()).toContain('klaro.main.purposes.thirdPartyContent.description');
    });
  });

  describe('when the section is an individual service', () => {
    it('renders a checkbox with corresponding label', () => {
      const wrapper = factory({ serviceData: bookWidgetServiceData });
      const checkbox = wrapper.find('b-form-checkbox-stub');

      expect(checkbox.text()).toContain('klaro.services.bookWidgets.title');
      expect(checkbox.text()).toContain('klaro.services.bookWidgets.description');
    });
  });

  describe('clicking the services display button', () => {
    it('toggles the show state', () => {
      const wrapper = factory({ serviceData: structuredServiceData });
      console.log(wrapper.html());
      wrapper.find('b-button-stub').trigger('click');
      expect(wrapper.vm.show).toEqual(['thirdPartyContent']);
      wrapper.find('b-button-stub').trigger('click');
      expect(wrapper.vm.show).toEqual([]);
    });
  });

  describe('updateConsent', () => {
    describe('when called for a specific service', () => {
      describe('when the service is required', () => {
        const requiredServiceData = {
          cookies: ['auth.stratgey'],
          name: 'auth-strategy',
          required: true,
          purposes: ['essential']
        };
        it('does not updates the consent in the Klaro manager the checkedServices', () => {
          const wrapper = factory({ serviceData: requiredServiceData });

          wrapper.vm.updateConsent(requiredServiceData, false);

          expect(klaroManager.updateConsent.called).toBe(false);

          expect(wrapper.vm.checkedServices.includes(requiredServiceData.name)).toBe(true);
        });
      });

      describe('when the service is not required', () => {
        it('updates the consent in the Klaro manager and the checkedServices', () => {
          const wrapper = factory({ serviceData: bookWidgetServiceData });

          wrapper.vm.updateConsent(bookWidgetServiceData, true);

          expect(klaroManager.updateConsent.called).toBe(true);

          expect(wrapper.vm.checkedServices.includes(bookWidgetServiceData.name)).toBe(true);
        });
      });
    });

    describe('when the service is aggregating multiple services', () => {
      describe('when the services are required', () => {
        it('does not updates the consent in the Klaro manager the checkedServices', () => {
          const requiredServicesData = {
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

          const wrapper = factory({ serviceData: requiredServicesData });

          wrapper.vm.updateConsent(requiredServicesData, false);

          expect(klaroManager.updateConsent.called).toBe(false);
          expect(wrapper.vm.checkedServices.includes('auth-strategy')).toBe(true);
          expect(wrapper.vm.checkedServices.includes('debugSettings')).toBe(true);
        });
      });

      describe('when the services are not required', () => {
        it('updates the consent in the Klaro manager and the checkedServices; including any aggregated services', () => {
          const wrapper = factory({ serviceData: structuredServiceData });

          wrapper.vm.updateConsent(structuredServiceData, true);

          expect(wrapper.vm.checkedServices.includes(structuredServiceData.name)).toBe(true);
          expect(wrapper.vm.checkedServices.includes(bookWidgetServiceData.name)).toBe(true);
          expect(klaroManager.updateConsent.called).toBe(true);
        });
      });
    });
  });
});
