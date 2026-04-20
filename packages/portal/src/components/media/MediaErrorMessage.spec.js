import { shallowMount } from '@vue/test-utils';
import MediaErrorMessage from '@/components/media/MediaErrorMessage.vue';

const factory = ({ propsData = {} } = {}) => shallowMount(MediaErrorMessage, {
  propsData,
  mocks: {
    $t: (key) => key
  },
  stubs: ['i18n']
});

describe('components/media/MediaErrorMessage', () => {
  it('shows a message about the media not being displayable', async() => {
    const wrapper = factory();

    const i18n =  wrapper.find('i18n-stub');

    expect(i18n.attributes('path')).toEqual('errorMessage.mediaFailure.description');
  });

  // TODO: add spec for when there is a provider URL available. Needs vue <i18n> support.
  //   const wrapper = factory({ providerUrl: 'https://example.org/test' });
  //   const providerLink =  wrapper.find('.provider-link');
  //   expect(providerLink.exists()).toBe(true);
});
