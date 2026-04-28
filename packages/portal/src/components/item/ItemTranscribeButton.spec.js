import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import ItemTranscribeButton from '@/components/item/ItemTranscribeButton';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = ({ mocks, propsData } = {}) => shallowMount(ItemTranscribeButton, {
  localVue,
  propsData: {
    ...propsData
  },
  mocks: {
    $features: {},
    $t: (key) => key,
    ...mocks
  }
});

describe('components/item/ItemTranscribeButton', () => {
  describe('when the transcribathonCta feature is disabled', () => {
    const $features = { transcribathonCta: false };

    it('does not render the component', () => {
      const wrapper = factory({
        mocks: { $features },
        propsData: { transcribeUrl: 'https://europeana.transcribathon.eu/documents/story/?story=123' }
      });

      const transcribeButton = wrapper.find('[data-qa="transcribe button"]');

      expect(transcribeButton.exists()).toBe(false);
    });
  });

  describe('when the transcribathonCta feature is enabled', () => {
    const $features = { transcribathonCta: true };

    describe('and the transcribe URL is for Transcribathon', () => {
      const transcribeUrl = 'https://europeana.transcribathon.eu/documents/story/?story=123';

      it('renders the component', () => {
        const wrapper = factory({ mocks: { $features }, propsData: { transcribeUrl } });

        const transcribeButton = wrapper.find('[data-qa="transcribe button"]');

        expect(transcribeButton.isVisible()).toBe(true);
      });

      it('opens a modal when clicked', async() => {
        const wrapper = factory({ mocks: { $features }, propsData: { transcribeUrl } });

        const bvModalShow = sinon.spy(wrapper.vm.$bvModal, 'show');

        const transcribeButton = wrapper.find('[data-qa="transcribe button"]');
        await transcribeButton.trigger('click');

        expect(bvModalShow.calledWith('contribute-transcribe-modal')).toBe(true);
      });
    });

    describe('but the transcribe URL is not for Transcribathon', () => {
      const transcribeUrl = 'https://example.org/123';

      it('does not render the component', () => {
        const wrapper = factory({ mocks: { $features }, propsData: { transcribeUrl } });

        const transcribeButton = wrapper.find('[data-qa="transcribe button"]');

        expect(transcribeButton.exists()).toBe(false);
      });
    });
  });
});
