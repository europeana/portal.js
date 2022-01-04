import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import Vuex from 'vuex';
import sinon from 'sinon';

import layout from '@/layouts/default';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

const store = new Vuex.Store({
  state: { breadcrumb: {} }
});

const factory = (data = {}) => shallowMount(layout, {
  localVue,
  store,
  data() {
    return data;
  },
  mocks: {
    $t: key => key,
    $auth: {
      $storage: {
        getUniversal: sinon.spy()
      }
    },
    $announcer: {
      setComplementRoute: () => {}
    },
    $features: {},
    $exp: {
      $variantIndexes: [0]
    },
    $route: {
      query: {}
    },
    $matomo: () => {},
    $i18n: {
      t: key => key
    }
  },
  stubs: {
    VueAnnouncer: { template: '<div id="announcer" aria-live="polite"></div>' },
    nuxt: true,
    PageHeader: true,
    PageFooter: true
  }
});

describe('layouts/default.vue', () => {
  describe('VueAnnouncer', () => {
    it('is enabled', () => {
      const wrapper = factory();
      expect(wrapper.find('#announcer').exists());
    });
  });

  describe('Klaro', () => {
    const klaroManagerStub = {
      watch: sinon.spy()
    };
    const klaroMock = {
      getManager: sinon.stub().returns(klaroManagerStub),
      render: sinon.spy()
    };

    describe('renderKlaro', () => {
      it('renders Klaro', () => {
        factory({ klaro: klaroMock });

        expect(klaroMock.render.called);
      });

      it('registers Klaro manager update watcher', () => {
        const wrapper = factory({ klaro: klaroMock });

        expect(klaroManagerStub.watch.calledWith({ update: wrapper.vm.watchKlaroManagerUpdate }));
      });
    });

    describe('watchKlaroManagerUpdate', () => {
      const wrapper = factory({ klaro: klaroMock });
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

              expect(wrapper.vm.trackKlaroClickEvent.calledWith(eventName));
            });
          });
        }
      });
    });

    describe('trackKlaroClickEvent', () => {
      it('tracks Klaro clicks with Matomo', () => {
        const wrapper = factory({ klaro: klaroMock });
        wrapper.vm.$matomo.trackEvent = sinon.spy();

        const eventName = 'Saved';
        wrapper.vm.trackKlaroClickEvent(eventName);

        expect(wrapper.vm.$matomo.trackEvent.calledWith('Klaro', 'Clicked', eventName));
      });
    });
  });
});
