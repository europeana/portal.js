import { createLocalVue, shallowMount } from '@vue/test-utils';
import DownloadSuccessModal from '@/components/download/DownloadSuccessModal.vue';

const localVue = createLocalVue();

const factory = (propsData) => {
  const wrapper = shallowMount(DownloadSuccessModal, {
    localVue,
    propsData,
    mocks: {
      $t: () => {}
    },
    stubs: ['ItemSnippetCopyButton', 'b-button', 'b-modal']
  });

  return wrapper;
};

describe('components/download/DownloadSuccessModal', () => {
  const propsData = {
    title: 'Fåtölj',
    year: '1700',
    provider: 'Gamla Linköping',
    country: 'Sweden',
    rights: 'CC0',
    url: '/en/item/565/S_GL_object_GL000004'
  };
  const attributionSnippet = 'Fåtölj - 1700 - Gamla Linköping, Sweden - CC0.\n/en/item/565/S_GL_object_GL000004';

  describe('template', () => {
    it('shows a formatted attribution snippet', () => {
      const wrapper = factory(propsData);

      const snippet =  wrapper.find('itemsnippetcopybutton-stub');
      expect(snippet.exists()).toBe(true);
      expect(snippet.attributes('text')).toEqual(attributionSnippet);
    });
  });
});
