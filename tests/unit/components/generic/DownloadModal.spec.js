import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import DownloadModal from '@/components/generic/DownloadModal.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData) => shallowMount(DownloadModal, {
  localVue,
  propsData,
  mocks: {
    $t: () => {}
  }
});

describe('components/generic/DownloadModal', () => {
  it('shows a formatted attribution snippet', () => {
    const propsData = {
      title: 'Fåtölj',
      year: '1700',
      provider: 'Gamla Linköping',
      country: 'Sweden',
      rights: 'CC0',
      url: '/en/item/565/S_GL_object_GL000004'
    };
    const attributionSnippet = 'Fåtölj - 1700 - Gamla Linköping, Sweden - CC0.\n/en/item/565/S_GL_object_GL000004';

    const wrapper = factory(propsData);

    const snippet =  wrapper.find('[data-qa="attribution snippet"]');
    expect(snippet.find('b-form-textarea-stub').exists()).toBe(true);
    expect(snippet.find('b-form-textarea-stub').attributes('value')).toContain(attributionSnippet);
  });
});
