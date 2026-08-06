import { shallowMountNuxt } from '@test/utils.js';
import sinon from 'sinon';

import MapSection from '@/components/generic/MapSection.vue';
import * as parallaxElementComposable from '@/composables/parallaxElement.js';

const config = {
  app: {
    baseUrl: 'https://www.example.org'
  }
};

const factory = () => shallowMountNuxt(MapSection, {
  propsData: {
    section: {
      name: 'Places',
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

    expect(title.text()).toBe('Places');
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

  it('applies parallax effect to the map element', () => {
    sinon.spy(parallaxElementComposable, 'useParallaxElement');

    factory();

    expect(parallaxElementComposable.useParallaxElement.calledWith('#places-europeana-map')).toBe(true);
  });
});
