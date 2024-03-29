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
    $i18n: {
      locale: 'en'
    },
    $matomo: {
      trackEvent: () => {}
    },
    $route: { params: {} },
    $t: (key) => key,
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
  afterEach(sinon.resetHistory);

  describe('mounted', () => {
    it('renders klaro', async() => {
      sinon.spy(mixin.methods, 'renderKlaro');

      factory();
      await new Promise(process.nextTick);

      expect(mixin.methods.renderKlaro.called).toBe(true);
    });
  });

  describe('when Matomo plugin is installed', () => {
    it('waits for Matomo to be ready first', () => {
      const $waitForMatomo = sinon.stub().resolves();

      factory({ mocks: { $waitForMatomo } });

      expect($waitForMatomo.called).toBe(true);
    });

    it('renders Klaro if Matomo becomes ready', async() => {
      const $waitForMatomo = sinon.stub().resolves();

      factory({ data: { klaro: klaroMock }, mocks: { $waitForMatomo } });
      await new Promise(process.nextTick);

      expect(klaroMock.render.called).toBe(true);
    });

    it('renders Klaro if Matomo does not become ready', async() => {
      const $waitForMatomo = sinon.stub().rejects();

      factory({ data: { klaro: klaroMock }, mocks: { $waitForMatomo } });
      await new Promise(process.nextTick);

      expect(klaroMock.render.called).toBe(true);
    });
  });

  describe('renderKlaro', () => {
    it('renders Klaro', async() => {
      const wrapper = factory();
      await wrapper.setData({ klaro: klaroMock });

      await wrapper.vm.renderKlaro();

      expect(klaroMock.render.called).toBe(true);
    });

    it('registers Klaro manager update watcher', async() => {
      const wrapper = factory();
      await wrapper.setData({ klaro: klaroMock });

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
});
