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
});
