import { createLocalVue, shallowMount } from '@vue/test-utils';
import MediaMetadataList from '@/components/media/MediaMetadataList';

const localVue = createLocalVue();

const factory = () => shallowMount(MediaMetadataList, {
  localVue,
  propsData: { resource: { edm: {
    about: 'http://www.example.eu/wrAbout',
    ebucoreHasMimeType: 'image/jpeg'
  } } },
  stubs: ['MetadataField']
});

describe('components/media/MediaMetadataList', () => {
  it('renders a metadata field for each web resource field', () => {
    const wrapper = factory();

    expect(wrapper.find('metadatafield-stub').exists()).toBe(true);
    expect(wrapper.findAll('metadatafield-stub').length).toBe(2);
  });
});
