import { shallowMountNuxt } from '@test/utils.js';
import MapSection from '@/components/generic/MapSection.vue';
import sinon from 'sinon';

const config = {
  app: {
    baseUrl: 'https://www.example.org'
  }
};

const factory = () => shallowMountNuxt(MapSection, {
  propsData: {
    section: {
      name: 'Title',
      moreButton: {
        link: '/destination',
        text: 'view more'
      }
    }
  },
  mocks: {
    $config: config
  },
  stubs: [
    'b-container',
    'ClientOnly',
    'SmartLink',
    'EntityOrganisationsMap'
  ]
});

describe('components/generic/MapSection', () => {
  it('renders a title', async() => {
    const wrapper = factory();

    const title =  wrapper.find('.card-group-title');

    expect(title.text()).toBe('Title');
  });

  it('renders a map in a client-only section', () => {
    const wrapper = factory();

    // This isn't testing for an actual map component as the client only section is stubbed.
    // For now we're only ever using the organisation entity map here anyways.
    const clientOnlyStub =  wrapper.find('clientonly-stub');

    expect(clientOnlyStub.exists()).toBe(true);
  });

  it('renders a view more link', () => {
    const wrapper = factory();

    const moreButton =  wrapper.find('.btn-outline-secondary');

    expect(moreButton.text()).toBe('view more');
  });

  describe('when the page is scrolled', () => {
    it('sets a parallax effect on the map element', async() => {
      const wrapper = factory();
      sinon.spy(wrapper.vm, 'parallaxMap');

      wrapper.vm.mounted();
      window.dispatchEvent(new Event('scroll'));

      expect(wrapper.vm.parallaxMap.called).toBe(true);
    });
  });

  describe('beforeDestroy', () => {
    it('removes the scroll event listener', () => {
      sinon.spy(window, 'removeEventListener');
      const wrapper = factory();

      wrapper.vm.beforeDestroy();

      expect(window.removeEventListener.calledWith('scroll', wrapper.vm.parallaxMap)).toBe(true);
    });
  });
});
