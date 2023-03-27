import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import ItemTranscribeButton from '@/components/item/ItemTranscribeButton';

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
  test('renders the component', () => {
    const wrapper = factory();

    const transcribeButton = wrapper.find('[data-qa="contribute transcribe button"]');

    expect(transcribeButton.exists()).toBe(true);
  });
});
