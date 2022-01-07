import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import InfoCardSection from '@/components/browse/InfoCardSection.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(InfoCardSection, {
  localVue
  // mocks: {
  //   $t: () => {}
  // }
});

const dummySection = {
  type: 'items/typeCounts',
  hasPartCollection: {
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
  }
};

describe('components/browse/InfoCardSection', () => {
  it('shows a section with cards', async() => {
    const wrapper = factory();
    await wrapper.setProps({ section: dummySection });

    expect(wrapper.findAll('[data-qa="section group"]').length).toBe(1);
  });
  it('shows a card for each element', async() => {
    const wrapper = factory();
    await wrapper.setProps({ section: dummySection });
    expect(wrapper.findAll('infocard-stub').length).toBe(3);
  });
  describe('cardGroupClass', () => {
    it('is three columns for mediaType counts', async() => {
      const wrapper = factory();
      await wrapper.setProps({ section: dummySection });

      expect(wrapper.vm.cardGroupClass).toBe('card-deck-3-cols');
    });
  });
  describe('cardVariant', () => {
    it('is default for mediaType counts', async() => {
      const wrapper = factory();
      await wrapper.setProps({ section: dummySection });

      expect(wrapper.vm.cardVariant).toBe('default');
    });
  });
});
