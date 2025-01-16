import { createLocalVue, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';

import mixin from '@/mixins/klaro';

const component = {
  template: '<div/>',
  mixins: [mixin]
};

const factory = ({ data = {}, mocks = {} } = {}) => shallowMount(component, {
  localVue: createLocalVue(),
  data() {
    return {
      ...data
    };
  },
  mocks: {
    $config: {
      matomo: { loadWait: { delay: 0, retries: 1 } }
    },
    $i18n: {
      locale: 'en'
    },
    initHotjar: sinon.spy(),
    $matomo: {
      forgetCookieConsentGiven: sinon.spy(),
      rememberCookieConsentGiven: sinon.spy(),
      trackEvent: () => {}
    },
    $route: { params: {} },
    $t: (key) => key,
    $features: {},
    ...mocks
  }
});

const klaroManagerStub = {
  watch: sinon.spy()
};
const klaroMock = {
  getManager: sinon.stub().returns(klaroManagerStub),
  render: sinon.spy()
};

describe('mixins/klaro', () => {
  beforeAll(() => {
    window.klaro = klaroMock;
  });
  afterAll(() => {
    delete window.klaro;
  });
  afterEach(sinon.resetHistory);

  describe('mounted', () => {
    it('renders klaro', async() => {
      sinon.spy(mixin.methods, 'renderKlaro');

      factory();
      await new Promise(process.nextTick);

      expect(mixin.methods.renderKlaro.called).toBe(true);
    });
  });

  describe('renderKlaro', () => {
    it('renders Klaro', async() => {
      const wrapper = factory();
      await new Promise(process.nextTick);

      await wrapper.vm.renderKlaro();

      expect(klaroMock.render.called).toBe(true);
    });

    it('registers Klaro manager update watcher', async() => {
      const wrapper = factory();
      await new Promise(process.nextTick);

      await wrapper.vm.renderKlaro();

      expect(klaroManagerStub.watch.calledWith({ update: wrapper.vm.watchKlaroManagerUpdate })).toBe(true);
    });
  });

  describe('watchKlaroManagerUpdate', () => {
    const wrapper = factory({ data: { klaro: klaroMock } });
    wrapper.vm.trackKlaroClickEvent = sinon.spy();
    const manager = null;

    describe('with event type "saveConsents"', () => {
      const eventType = 'saveConsents';

      const clickEvents = {
        accept: 'Okay/Accept all',
        decline: 'Decline',
        save: 'Accept selected'
      };
      for (const dataType in clickEvents) {
        describe(`and data type "${dataType}"`, () => {
          const data = { type: dataType };
          const eventName = clickEvents[dataType];
          it(`tracks Klaro click event with name "${eventName}"`, () => {
            wrapper.vm.watchKlaroManagerUpdate(manager, eventType, data);

            expect(wrapper.vm.trackKlaroClickEvent.calledWith(eventName)).toBe(true);
          });
        });
      }
    });
  });

  describe('trackKlaroClickEvent', () => {
    it('tracks Klaro clicks with Matomo', () => {
      const wrapper = factory({ data: { klaro: klaroMock } });
      wrapper.vm.$matomo.trackEvent = sinon.spy();

      const eventName = 'Saved';
      wrapper.vm.trackKlaroClickEvent(eventName);

      expect(wrapper.vm.$matomo.trackEvent.calledWith('Klaro', 'Clicked', eventName)).toBe(true);
    });
  });

  describe('klaroServiceConsentCallback', () => {
    describe('when service is matomo', () => {
      const service = { name: 'matomo' };

      describe('and consent is true', () => {
        const consent = true;
        it('instructs matomo to remember cookie consent given', () => {
          const wrapper = factory();

          wrapper.vm.klaroServiceConsentCallback(consent, service);

          expect(wrapper.vm.$matomo.rememberCookieConsentGiven.called).toBe(true);
        });
      });

      describe('and consent is false', () => {
        const consent = false;
        it('instructs matomo to forget cookie consent given', () => {
          const wrapper = factory();

          wrapper.vm.klaroServiceConsentCallback(consent, service);

          expect(wrapper.vm.$matomo.forgetCookieConsentGiven.called).toBe(true);
        });
      });
    });

    describe('when service is hotjar', () => {
      const service = { name: 'hotjar' };

      describe('and consent is true', () => {
        const consent = true;
        it('initialises hotjar', () => {
          const wrapper = factory();

          wrapper.vm.klaroServiceConsentCallback(consent, service);

          expect(wrapper.vm.initHotjar.called).toBe(true);
        });
      });

      describe('and consent is false', () => {
        const consent = false;
        const { location } = window;

        beforeAll(() => {
          delete window.location;
          window.location = {
            reload: sinon.spy()
          };
        });

        afterAll(() => {
          window.location = location;
        });

        describe('and window.hj is present', () => {
          beforeAll(() => {
            window.hj = {};
          });

          afterAll(() => {
            delete window.hj;
          });

          it('reloads the page to get rid of hotjar', () => {
            const wrapper = factory();

            wrapper.vm.klaroServiceConsentCallback(consent, service);

            expect(window.location.reload.called).toBe(true);
          });
        });

        describe('and window.hj is not present', () => {
          it('does not reload the page', () => {
            const wrapper = factory();

            wrapper.vm.klaroServiceConsentCallback(consent, service);

            expect(window.location.reload.called).toBe(false);
          });
        });
      });
    });
  });
});
