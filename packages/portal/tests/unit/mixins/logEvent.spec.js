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
        const $features = { eventLogging: false };
        it('does not post to event logging API', async() => {
          const wrapper = factory({ mocks: { $features } });

          await wrapper.vm.logEvent('like', 'http://data.europeana.eu/item/123/abc');

          expect(nock.isDone()).toBe(false);
        });
      });

      describe('when feature is enabled', () => {
        const $features = { eventLogging: true };

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

              const logged = await wrapper.vm.logEvent('like', 'http://data.europeana.eu/item/123/abc');

              expect(nock.isDone()).toBe(false);
              expect(logged).toBe(false);
            });
          });

          describe('when there is no active session', () => {
            it('does not post to event logging API', async() => {
              const wrapper = factory({ mocks: { $features, $session: {} } });

              const logged = await wrapper.vm.logEvent('like', 'http://data.europeana.eu/item/123/abc');

              expect(nock.isDone()).toBe(false);
              expect(logged).toBe(false);
            });
          });

          describe('when there is an active session', () => {
            it('posts to event logging API', async() => {
              const wrapper = factory({ mocks: { $features, $session: { isActive: true } } });

              const logged = await wrapper.vm.logEvent('like', 'http://data.europeana.eu/item/123/abc');

              expect(nock.isDone()).toBe(true);
              expect(logged).toBe(true);
            });
          });
        });
      });
    });
  });
});
