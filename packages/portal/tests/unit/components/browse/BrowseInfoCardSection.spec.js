import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import BrowseInfoCardSection from '@/components/browse/BrowseInfoCardSection.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(BrowseInfoCardSection, {
  localVue
});

const hasPartCollection = {
  items: [
    {
      url: { name: 'dummyURLone' },
      info: '100,000',
      label: 'IMAGES',
      image: 'ic-image'
    },
    {
      url: { name: 'dummyURLtwo' },
      info: '50,000',
      label: 'VIDEOS',
      image: 'ic-video'
    },
    {
      url: { name: 'dummyURLthree' },
      info: '2,000',
      label: '3D',
      image: 'ic-3d'
    }
  ]
};

const typeCountsSection = {
  type: 'items/type-counts',
  hasPartCollection
};

const defaultSection = {
  hasPartCollection
};

describe('components/browse/BrowseInfoCardSection', () => {
  it('shows a section with cards', async() => {
    const wrapper = factory();
    await wrapper.setProps({ section: typeCountsSection });

    expect(wrapper.findAll('[data-qa="section group"]').length).toBe(1);
  });
  it('shows a card for each element', async() => {
    const wrapper = factory();
    await wrapper.setProps({ section: typeCountsSection });
    expect(wrapper.findAll('infocard-stub').length).toBe(3);
  });
  describe('cardGroupClass', () => {
    it('is three columns for mediaType counts', async() => {
      const wrapper = factory();
      await wrapper.setProps({ section: typeCountsSection });

      expect(wrapper.vm.cardGroupClass).toBe('card-deck-3-cols');
    });
    it('is four columns by default', async() => {
      const wrapper = factory();
      await wrapper.setProps({ section: defaultSection });

      expect(wrapper.vm.cardGroupClass).toBe('card-deck-4-cols');
    });
  });
  describe('cardVariant', () => {
    it('is dark for mediaType counts', async() => {
      const wrapper = factory();
      await wrapper.setProps({ section: typeCountsSection });

      expect(wrapper.vm.cardVariant).toBe('dark');
    });
    it('is default by default', async() => {
      const wrapper = factory();
      await wrapper.setProps({ section: defaultSection });

      expect(wrapper.vm.cardVariant).toBe('default');
    });
  });
});
