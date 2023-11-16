import Vue from 'vue';
import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../utils';
import nock from 'nock';
import sinon from 'sinon';

import mixin from '@/mixins/logEvent';

const component = {
  template: '<div></div>',
  mixins: [mixin]
};

const localVue = createLocalVue();

const factory = ({ mocks = {} } = {}) => shallowMountNuxt(component, {
  localVue,
  mocks: {
    $config: {
      app: {
        baseUrl: 'http://localhost'
      }
    },
    $features: {},
    ...mocks
  }
});

const fixtures = {
  features: {
    disabled: { eventLogging: false },
    enabled: { eventLogging: true }
  },
  session: {
    inactive: Vue.observable({ isActive: false }),
    active: Vue.observable({ isActive: true })
  }
};

describe('mixins/logEvent', () => {
  beforeEach(() => {
    nock('http://localhost')
      .post('/_api/events')
      .reply(204);
  });
  afterEach(() => {
    sinon.resetHistory();
    nock.cleanAll();
  });
  afterAll(sinon.resetBehavior);

  describe('methods', () => {
    describe('logEvent', () => {
      describe('when feature is not enabled', () => {
        const $features = fixtures.features.disabled;

        it('does not post to event logging API', async() => {
          const wrapper = factory({ mocks: { $features } });

          await wrapper.vm.logEvent('like', 'http://data.europeana.eu/item/123/abc');

          expect(nock.isDone()).toBe(false);
        });
      });

      describe('when feature is enabled', () => {
        const $features = fixtures.features.enabled;

        describe('when running on server', () => {
          beforeAll(() => {
            process.server = true;
            process.client = false;
          });
          afterAll(() => {
            delete process.server;
            delete process.client;
          });

          it('does not post to event logging API', async() => {
            const wrapper = factory({ mocks: { $features } });

            await wrapper.vm.logEvent('like', 'http://data.europeana.eu/item/123/abc');

            expect(nock.isDone()).toBe(false);
          });
        });

        describe('when running on client', () => {
          beforeAll(() => {
            process.server = false;
            process.client = true;
          });
          afterAll(() => {
            delete process.server;
            delete process.client;
          });

          describe('when user agent is a known bot', () => {
            let userAgent;
            beforeAll(() => {
              userAgent = navigator.userAgent;
              sinon.stub(navigator, 'userAgent').get(() => 'Bot!');
            });
            afterAll(() => {
              // sinon resets don't seem to restore the getter to its default...
              sinon.stub(navigator, 'userAgent').get(() => userAgent);
            });

            it('does not post to event logging API', async() => {
              const wrapper = factory({ mocks: { $features } });

              await wrapper.vm.logEvent('like', 'http://data.europeana.eu/item/123/abc');

              expect(nock.isDone()).toBe(false);
            });
          });

          describe('when there is no active session', () => {
            const $session = fixtures.session.inactive;

            it('does not post to event logging API', async() => {
              const wrapper = factory({ mocks: { $features, $session } });

              await wrapper.vm.logEvent('like', 'http://data.europeana.eu/item/123/abc');

              expect(nock.isDone()).toBe(false);
            });

            describe('but then the session becomes active', () => {
              it('posts to event logging API', async() => {
                const wrapper = factory({ mocks: { $features, $session } });

                await wrapper.vm.logEvent('like', 'http://data.europeana.eu/item/123/abc');

                wrapper.vm.$session.isActive = true;
                await new Promise(process.nextTick);

                expect(nock.isDone()).toBe(true);
              });
            });
          });

          describe('when there is an active session', () => {
            const $session = fixtures.session.active;

            it('posts to event logging API', async() => {
              const wrapper = factory({ mocks: { $features, $session } });

              await wrapper.vm.logEvent('like', 'http://data.europeana.eu/item/123/abc');

              expect(nock.isDone()).toBe(true);
            });
          });
        });
      });
    });
  });
});
