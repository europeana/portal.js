import { createLocalVue, shallowMount } from '@vue/test-utils';
import MediaMetadataCollapseList from '@/components/media/MediaMetadataCollapseList';
import BootstrapVue from 'bootstrap-vue';
import WebResource from '@/plugins/europeana/edm/WebResource.js';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData) => shallowMount(MediaMetadataCollapseList, {
  localVue,
  propsData
});

describe('components/media/MediaMetadataCollapseList', () => {
  it('renders a collapsed metadata list for each web resource', () => {
    const wrapper = factory({ webResources: [
      new WebResource({
        ebucoreHasMimeType: 'model/gltf-binary'
      })
    ] });

    expect(wrapper.find('b-collapse-stub').exists()).toBe(true);
    expect(wrapper.findAll('b-collapse-stub').length).toBe(1);
    expect(wrapper.find('mediametadatalist-stub').exists()).toBe(true);
  });
});
