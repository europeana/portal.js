import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import ErrorMessage from '@/components/generic/ErrorMessage.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const props = {
  error: 'Item was not found',
  titlePath: 'errorMessage.item.title',
  descriptionPath: 'errorMessage.item.description',
  illustrationSrc: 'src/assets/img/illustrations/il-item-not-found.svg'
};

const factory = (propsData = {}) => shallowMount(ErrorMessage, {
  localVue,
  propsData,
  mocks: {
    $t: (key) => key
  },
  stubs: ['i18n']
});

describe('components/generic/ErrorMessage', () => {
  it('displays a description when available', async() => {
    const wrapper = factory(props);

    const illustration =  wrapper.find('[data-qa="error message"]');
    expect(illustration.text()).toEqual(props.descriptionPath);
  });
  it('displays empty string when description unavailable', async() => {
    const wrapper = factory();

    const illustration =  wrapper.find('[data-qa="error message"]');
    expect(illustration.text()).toEqual('');
  });
});
