import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import DownloadModal from '../../../../src/components/generic/DownloadModal.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(DownloadModal, {
  localVue,
  mocks: {
    $t: () => {}
  }
});

const attributionSnippet = 'Fåtölj - 1700 - Gamla Linköping - Sweden - CC0 - /en/item/565/S_GL_object_GL000004';

describe('components/generic/DownloadModal', () => {
  it('shows a snippet', async() => {
    const wrapper = factory();
    await wrapper.setProps({ attributionSnippet });

    const snippet =  wrapper.find('[data-qa="attribution snippet"]');
    snippet.find('b-form-textarea-stub').exists().should.be.true;
    snippet.find('b-form-textarea-stub').attributes('value').should.contain(attributionSnippet);
  });
});
