import { createLocalVue, shallowMount } from '@vue/test-utils';
import * as hotjar from '@/utils/hotjar.js';
import sinon from 'sinon';

import mixin from '@/mixins/klaro';

const checkConsentAndOpenEmbedStub = sinon.stub();
const component = {
  template: '<div/>',
  methods: {
    checkConsentAndOpenEmbed: checkConsentAndOpenEmbedStub
  },
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
    $te: () => true,
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
let initHotjarStub;

describe('mixins/klaro', () => {
  beforeAll(() => {
    window.klaro = klaroMock;
    initHotjarStub = sinon.stub(hotjar, 'default');
  });
  afterAll(() => {
    delete window.klaro;
    sinon.reset();
  });
  afterEach(sinon.resetHistory);

  describe('mounted', () => {
    it('does not render klaro', async() => {
      factory();

      await new Promise(process.nextTick);

      expect(klaroMock.render.called).toBe(false);
    });
  });

  describe('renderKlaro', () => {
    it('registers Klaro manager update watcher', async() => {
      const wrapper = factory();
      await new Promise(process.nextTick);

      await wrapper.vm.renderKlaro();

      expect(klaroManagerStub.watch.calledWith({ update: wrapper.vm.watchKlaroManagerUpdate })).toBe(true);
    });
  });

  describe('watchKlaroManagerUpdate', () => {
    const wrapper = factory({ data: { klaro: klaroMock } });
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
          it('calls checkConsentAndOpenEmbed', () => {
            wrapper.vm.watchKlaroManagerUpdate(manager, eventType, data);

            expect(checkConsentAndOpenEmbedStub.called).toBe(true);
          });
        });
      }
    });
  });

  describe('klaroServiceConsentCallback', () => {
    describe('when service is matomo', () => {
      const service = { name: 'matomo' };

      describe('and consent is true', () => {
        const consent = true;
        it('instructs matomo to remember cookie consent given', async() => {
          const wrapper = factory();

          await wrapper.vm.klaroServiceConsentCallback(consent, service);

          expect(wrapper.vm.$matomo.rememberCookieConsentGiven.called).toBe(true);
        });
      });

      describe('and consent is false', () => {
        const consent = false;
        it('instructs matomo to forget cookie consent given', async() => {
          const wrapper = factory();

          await wrapper.vm.klaroServiceConsentCallback(consent, service);

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

          expect(initHotjarStub.called).toBe(true);
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
