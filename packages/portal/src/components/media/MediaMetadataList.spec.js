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
    const wrapper = factory({ resource: { edm: {
      ebucoreHasMimeType: 'image/jpeg'
    } } });

    expect(wrapper.find('metadatafield-stub').exists()).toBe(true);
    expect(wrapper.findAll('metadatafield-stub').length).toBe(1);
  });

  describe('when web resource needs full metadata lookup', () => {
    it('gets the data from the relevant web resource', () => {
      const wrapper = factory({
        resource: { edm: {
          about: 'http://www.example.eu/wrAbout1'
        } },
        webResources: [{
          about: 'http://www.example.eu/wrAbout'
        }, {
          about: 'http://www.example.eu/wrAbout1',
          ebucoreHasMimeType: 'image/jpeg',
          ebucoreOrientation: 'portrait'
        }]
      });

      expect(wrapper.find('metadatafield-stub').exists()).toBe(true);
      expect(wrapper.vm.fullWebResource.ebucoreOrientation).toBe('portrait');
      expect(wrapper.findAll('metadatafield-stub').length).toBe(2);
    });
  });

  describe('displayWebResourceMetadata', () => {
    it('filters out data not for display', () => {
      const wrapper = factory({
        resource: { edm: {
          about: 'http://www.example.eu/wrAbout1',
          ebucoreHasMimeType: 'image/jpeg',
          isNextInSequence: 'http://www.example.eu/wrAbout2'
        } }
      });

      expect(wrapper.vm.displayWebResourceMetadata.isNextInSequence).toBe(undefined);
      expect(wrapper.vm.displayWebResourceMetadata.ebucoreHasMimeType).toBe('image/jpeg');
      expect(wrapper.findAll('metadatafield-stub').length).toBe(1);
    });
  });
});
