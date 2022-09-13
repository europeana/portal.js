import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import ErrorMessage from '@/components/generic/ErrorMessage.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData = {}) => shallowMount(ErrorMessage, {
  localVue,
  propsData,
  mocks: {
    $t: (key) => key
  },
  stubs: ['i18n']
});

describe('components/generic/ErrorMessage', () => {
  it('displays illustrated error with description when available', async() => {
    const props = {
      error: 'Item was not found',
      titlePath: 'errorMessage.itemNotFound.title',
      descriptionPath: 'errorMessage.itemNotFound.description',
      illustrationSrc: 'src/assets/img/illustrations/il-item-not-found.svg'
    };
    const wrapper = factory(props);

    const text = wrapper.text();

    expect(text).toEqual(props.descriptionPath);
  });
});
