import Vue from 'vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import nock from 'nock';
import sinon from 'sinon';

import { useLogEvent } from '@/composables/logEvent.js';

const component = {
  template: '<span />',
  setup() {
    const { logEvent } = useLogEvent();
    return { logEvent };
  }
};

const factory = ({ $features } = {}) => {
  const wrapper = shallowMount(component, {
    localVue: createLocalVue()
  });
  wrapper.vm.$root.$features = $features;
  return wrapper;
};

let $features;
let session;

const scenarios = {
  'when feature is enabled'() {
    $features = { eventLogging: true };
  },
  'when feature is not enabled'() {
    $features = { eventLogging: false };
  },
  'when running on client'() {
    beforeAll(() => {
      process.server = false;
      process.client = true;
    });
    afterAll(() => {
      delete process.server;
      delete process.client;
    });
  },
  'when running on server'() {
    beforeAll(() => {
      process.server = true;
      process.client = false;
    });
    afterAll(() => {
      delete process.server;
      delete process.client;
    });
  },
  'when there is an active session'() {
    session = Vue.observable({ id: 'session-789', isActive: true });
  },
  'when there is not an active session'() {
    session = Vue.observable({ id: 'session-789', isActive: false });
  },
  'when user agent is a known bot'() {
    let userAgent;
    beforeAll(() => {
      userAgent = navigator.userAgent;
      sinon.stub(navigator, 'userAgent').get(() => 'Bot!');
    });
    afterAll(() => {
      // sinon resets don't seem to restore the getter to its default...
      sinon.stub(navigator, 'userAgent').get(() => userAgent);
    });
  }
};

const describe = (description, callback) => {
  global.describe(description, () => {
    scenarios[description]?.();
    callback();
  });
};

const objectUri = 'http://data.europeana.eu/item/123/abc';
const actionType = 'like';

describe('useLogEvent', () => {
  beforeEach(() => {
    nock('http://localhost')
      .post('/_api/events', () => true)
      .reply(204);
  });
  beforeAll(() => {
    nock.disableNetConnect();
  });
  afterEach(() => {
    sinon.resetHistory();
    nock.cleanAll();
  });
  afterAll(() => {
    sinon.resetBehavior();
    nock.enableNetConnect();
  });

  describe('logEvent', () => {
    describe('when feature is not enabled', () => {
      describe('when there is an active session', () => {
        it('does not post to event logging API', async() => {
          const wrapper = factory({ $features });

          await wrapper.vm.logEvent(actionType, objectUri, session);

          expect(nock.isDone()).toBe(false);
        });
      });
    });

    describe('when feature is enabled', () => {
      describe('when running on server', () => {
        describe('there is an active session', () => {
          it('does not post to event logging API', async() => {
            const wrapper = factory({ $features });

            await wrapper.vm.logEvent(actionType, objectUri, session);

            expect(nock.isDone()).toBe(false);
          });
        });
      });

      describe('when running on client', () => {
        describe('when user agent is a known bot', () => {
          describe('when there is an active session', () => {
            it('does not post to event logging API', async() => {
              const wrapper = factory({ $features });

              await wrapper.vm.logEvent(actionType, objectUri, session);

              expect(nock.isDone()).toBe(false);
            });
          });
        });

        describe('when there is not an active session', () => {
          it('does not post to event logging API', async() => {
            const wrapper = factory({ $features });

            await wrapper.vm.logEvent(actionType, objectUri, session);
            wrapper.destroy();
            expect(nock.isDone()).toBe(false);
          });

          describe('but then the session becomes active', () => {
            it('posts to event logging API', async() => {
              const wrapper = factory({ $features });

              await wrapper.vm.logEvent(actionType, objectUri, session);
              session.isActive = true;
              await new Promise(process.nextTick);

              expect(nock.isDone()).toBe(true);
            });
          });
        });

        describe('when there is an active session', () => {
          it('posts to event logging API', async() => {
            const wrapper = factory({ $features });

            await wrapper.vm.logEvent(actionType, objectUri, session);
            await new Promise(process.nextTick);

            expect(nock.isDone()).toBe(true);
          });
        });
      });
    });
  });
});
