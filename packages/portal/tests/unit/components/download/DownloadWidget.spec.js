import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import DownloadWidget from '@/components/download/DownloadWidget.vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = ({ propsData = {}, data = {}, mocks = {} } = {}) => {
  const wrapper = shallowMount(DownloadWidget, {
    localVue,
    propsData,
    data: () => ({ ...data }),
    mocks
  });
  sinon.spy(wrapper.vm.$bvModal, 'show');
  return wrapper;
};

describe('components/download/DownloadWidget', () => {
  afterEach(() => {
    sinon.resetHistory();
  });

  const propsData = {
    url: 'https://example.org/image.jpeg',
    identifier: '/123/abc',
    rightsStatement: 'http://creativecommons.org/licenses/by-nc/4.0/'
  };

  describe('template', () => {
    describe('download button', () => {
      it('exists', () => {
        const wrapper = factory({ propsData });

        const downloadButton = wrapper.find('[data-qa="download button"]');

        expect(downloadButton.exists()).toBe(true);
      });

      describe('when it emits `download` event', () => {
        it('shows the download success modal', () => {
          const wrapper = factory({ propsData });

          const downloadButton = wrapper.find('[data-qa="download button"]');
          downloadButton.vm.$emit('download');

          expect(wrapper.vm.$bvModal.show.calledWith('download-success-modal')).toBe(true);
        });
      });

      describe('when it emits `downloadError` event', () => {
        it('shows the download failed modal', () => {
          const wrapper = factory({ propsData });

          const downloadButton = wrapper.find('[data-qa="download button"]');
          downloadButton.vm.$emit('downloadError');

          expect(wrapper.vm.$bvModal.show.calledWith('download-failed-modal')).toBe(true);
        });
      });
    });
  });
});
