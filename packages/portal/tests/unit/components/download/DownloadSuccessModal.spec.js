import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import DownloadSuccessModal from '@/components/download/DownloadSuccessModal.vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData) => {
  const wrapper = shallowMount(DownloadSuccessModal, {
    localVue,
    propsData,
    mocks: {
      $t: () => {}
    }
  });
  wrapper.vm.$refs.attributionSnippet.select = sinon.spy();
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

      const snippet =  wrapper.find('[data-qa="attribution snippet"]');
      expect(snippet.find('cite').exists()).toBe(true);
      expect(snippet.find('cite').text()).toContain(attributionSnippet);
    });
  });

  describe('methods', () => {
    describe('copySnippet', () => {
      it('writes the attribution snippet to the navigator clipboard', () => {
        const wrapper = factory(propsData);

        wrapper.vm.copySnippet();

        expect(global.navigator.clipboard.writeText.calledWith(attributionSnippet)).toBe(true);
      });

      it('records that the snippet was copied to the clipboard', async() => {
        const wrapper = factory(propsData);

        await wrapper.vm.copySnippet();

        expect(wrapper.vm.snippetCopied).toBe(true);
      });
    });
  });
});
