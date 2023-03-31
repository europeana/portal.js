import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import ItemTranscribeButton from '@/components/item/ItemTranscribeButton';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(ItemTranscribeButton, {
  localVue,
  propsData: {
    transcribeUrl: 'https://example.com'
  },
  mocks: {
    $t: (key) => key
  }
});

describe('components/item/ItemTranscribeButton', () => {
  it('renders the component', () => {
    const wrapper = factory();

    const transcribeButton = wrapper.find('[data-qa="transcribe button"]');

    expect(transcribeButton.exists()).toBe(true);
  });

  it('opens a modal when clicked', async() => {
    const wrapper = factory();

    const bvModalShow = sinon.spy(wrapper.vm.$bvModal, 'show');

    const transcribeButton = wrapper.find('[data-qa="transcribe button"]');
    await transcribeButton.trigger('click');

    expect(bvModalShow.calledWith('contribute-transcribe-modal')).toBe(true);
  });
});
