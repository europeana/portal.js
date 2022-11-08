import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import DownloadButton from '@/components/download/DownloadButton.vue';
import nock from 'nock';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = ({ propsData = {}, data = {}, mocks = {} } = {}) => {
  const wrapper = shallowMount(DownloadButton, {
    localVue,
    propsData,
    data: () => ({ ...data }),
    mocks: {
      $apm: { captureError: sinon.spy() },
      $matomo: { trackEvent: sinon.spy() },
      $t: (key) => key,
      ...mocks
    }
  });
  wrapper.vm.$refs.downloadButton.$el = { click: sinon.spy() };
  return wrapper;
};

describe('components/download/DownloadButton', () => {
  beforeAll(() => {
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.cleanAll();
    sinon.resetHistory();
  });

  afterAll(() => {
    nock.enableNetConnect();
  });

  const urlOrigin = 'https://example.org';
  const urlPath = '/image.jpeg';
  const propsData = {
    url: `${urlOrigin}${urlPath}`,
    identifier: '/123/abc'
  };

  const nockRequest = () => nock(urlOrigin).head(urlPath);

  describe('template', () => {
    describe('download button', () => {
      it('exists, for URL', () => {
        const wrapper = factory({ propsData });

        const button = wrapper.find('[data-qa="download button"]');

        expect(button.exists()).toBe(true);
        expect(button.attributes('href')).toBe(propsData.url);
      });
    });
  });

  describe('computed', () => {
    describe('isDownloadValidationRequired', () => {
      describe('when URL is already validated', () => {
        const data = { urlValidated: true, validationNetworkError: false };

        it('is `false`', () => {
          const wrapper = factory({ propsData, data });

          const isDownloadValidationRequired = wrapper.vm.isDownloadValidationRequired;

          expect(isDownloadValidationRequired).toBe(false);
        });
      });

      describe('when URL validatation attempt failed with network error', () => {
        const data = { urlValidated: false, validationNetworkError: true };

        it('is `false`', () => {
          const wrapper = factory({ propsData, data });

          const isDownloadValidationRequired = wrapper.vm.isDownloadValidationRequired;

          expect(isDownloadValidationRequired).toBe(false);
        });
      });

      describe('when URL validatation has not been attempted', () => {
        const data = { urlValidated: false, validationNetworkError: false };

        it('is `true`', () => {
          const wrapper = factory({ propsData, data });

          const isDownloadValidationRequired = wrapper.vm.isDownloadValidationRequired;

          expect(isDownloadValidationRequired).toBe(true);
        });
      });
    });
  });

  describe('methods', () => {
    describe('handleClickDownloadButton', () => {
      const event = { preventDefault: sinon.spy() };

      describe('when validation is not required', () => {
        const data = { urlValidated: true };

        it('emits the `download` event', async() => {
          const wrapper = factory({ propsData, data });

          await wrapper.vm.handleClickDownloadButton(event);

          expect(wrapper.emitted('download').length).toBe(1);
        });

        it('tracks the event in Matomo', async() => {
          const wrapper = factory({ propsData, data });

          await wrapper.vm.handleClickDownloadButton(event);

          expect(wrapper.vm.$matomo.trackEvent.calledWith(
            'Item_download', 'Click download button', propsData.url
          )).toBe(true);
        });

        it('does not prevent the event default', async() => {
          const wrapper = factory({ propsData, data });

          await wrapper.vm.handleClickDownloadButton(event);

          expect(event.preventDefault.called).toBe(false);
        });

        it('does not validate the URL', async() => {
          const wrapper = factory({ propsData, data });
          nockRequest().reply(200);

          await wrapper.vm.handleClickDownloadButton(event);

          expect(nock.isDone()).toBe(false);
        });
      });

      describe('when validation is required', () => {
        it('prevents the event default', async() => {
          const wrapper = factory({ propsData });
          nockRequest().reply(200);

          await wrapper.vm.handleClickDownloadButton(event);

          expect(event.preventDefault.called).toBe(true);
        });

        it('validates the URL', async() => {
          const wrapper = factory({ propsData });
          nockRequest().reply(200);

          await wrapper.vm.handleClickDownloadButton(event);

          expect(nock.isDone()).toBe(true);
        });

        describe('and the URL was validated', () => {
          beforeEach(() => nockRequest().reply(200));

          it('re-clicks the download button', async() => {
            const wrapper = factory({ propsData });

            await wrapper.vm.handleClickDownloadButton(event);

            expect(wrapper.vm.$refs.downloadButton.$el.click.called).toBe(true);
          });

          it('records that the download has been validated', async() => {
            const wrapper = factory({ propsData });

            await wrapper.vm.handleClickDownloadButton(event);

            expect(wrapper.vm.urlValidated).toBe(true);
          });
        });

        describe('but the URL validation failed with a Network Error, e.g. CORS', () => {
          const message = 'Network Error';
          beforeEach(() => nockRequest().replyWithError({ message }));

          it('re-clicks the download button', async() => {
            const wrapper = factory({ propsData });

            await wrapper.vm.handleClickDownloadButton(event);

            expect(wrapper.vm.$refs.downloadButton.$el.click.called).toBe(true);
          });

          it('records that the download validation failed with a network error', async() => {
            const wrapper = factory({ propsData });

            await wrapper.vm.handleClickDownloadButton(event);

            expect(wrapper.vm.validationNetworkError).toBe(true);
          });

          it('captures the network error to APM', async() => {
            const wrapper = factory({ propsData });

            await wrapper.vm.handleClickDownloadButton(event);

            expect(wrapper.vm.$apm.captureError.calledWith({
              name: 'DownloadValidationNetworkError',
              message,
              item: propsData.identifier,
              url: propsData.url
            })).toBe(true);
          });
        });

        describe('but the URL validation failed with a non-Network Error, e.g. 400 Bad Request', () => {
          beforeEach(() => nockRequest().reply(400));

          it('does not re-click the download button', async() => {
            const wrapper = factory({ propsData });

            await wrapper.vm.handleClickDownloadButton(event);

            expect(wrapper.vm.$refs.downloadButton.$el.click.called).toBe(false);
          });

          it('captures the validation error to APM', async() => {
            const wrapper = factory({ propsData });

            await wrapper.vm.handleClickDownloadButton(event);

            expect(wrapper.vm.$apm.captureError.calledWith({
              name: 'DownloadError',
              message: 'Request failed with status code 400',
              status: 400,
              item: '/123/abc',
              url: 'https://example.org/image.jpeg'
            })).toBe(true);
          });

          it('emits the `downloadError` event', async() => {
            const wrapper = factory({ propsData });

            await wrapper.vm.handleClickDownloadButton(event);

            expect(wrapper.emitted('downloadError').length).toBe(1);
          });
        });
      });
    });
  });
});
