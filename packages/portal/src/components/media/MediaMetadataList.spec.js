import { createLocalVue, shallowMount } from '@vue/test-utils';
import MediaMetadataList from '@/components/media/MediaMetadataList';

const localVue = createLocalVue();

const factory = (propsData) => shallowMount(MediaMetadataList, {
  localVue,
  propsData,
  stubs: ['MetadataField']
});

describe('components/media/MediaMetadataList', () => {
  it('renders a metadata field for each web resource field', () => {
    const wrapper = factory({ webResource: {
      ebucoreHasMimeType: 'image/jpeg'
    } });

    expect(wrapper.find('metadatafield-stub').exists()).toBe(true);
    expect(wrapper.findAll('metadatafield-stub').length).toBe(1);
  });
});
