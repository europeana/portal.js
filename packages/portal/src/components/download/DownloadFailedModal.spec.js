import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import DownloadFailedModal from '@/components/download/DownloadFailedModal.vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = ({ propsData = {} } = {}) => {
  const wrapper = shallowMount(DownloadFailedModal, {
    localVue,
    propsData,
    mocks: {
      $t: (key) => key
    }
  });
  sinon.spy(wrapper.vm.$bvModal, 'hide');
  return wrapper;
};

describe('components/download/DownloadFailedModal', () => {
  describe('template', () => {
    describe('close button', () => {
      it('exists', () => {
        const wrapper = factory();

        const closeButton = wrapper.find('[data-qa="close button"]');

        expect(closeButton.exists()).toBe(true);
      });

      it('closes the modal when clicked', () => {
        const wrapper = factory();

        const closeButton = wrapper.find('[data-qa="close button"]');
        closeButton.trigger('click');

        expect(wrapper.vm.$bvModal.hide.calledWith('download-failed-modal')).toBe(true);
      });
    });

    describe('provider link button', () => {
      describe('when provider URL is present', () => {
        const propsData = {
          providerUrl: 'https://example.org/item1'
        };

        it('exists, linking to provider URL', () => {
          const wrapper = factory({ propsData });

          const providerLinkButton = wrapper.find('[data-qa="provider link button"]');

          expect(providerLinkButton.exists()).toBe(true);
          expect(providerLinkButton.attributes('href')).toBe(propsData.providerUrl);
        });
      });

      describe('when provider URL is not present', () => {
        const propsData = {};

        it('does not exist', () => {
          const wrapper = factory({ propsData });

          const providerLinkButton = wrapper.find('[data-qa="provider link button"]');

          expect(providerLinkButton.exists()).toBe(false);
        });
      });
    });
  });
});
