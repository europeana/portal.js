import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import ErrorMessage from '@/components/generic/ErrorMessage.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(ErrorMessage, {
  localVue,
  propsData: { variant: 'item' },
  mocks: {
    $t: () => {}
  },
  stubs: ['i18n']
});

describe('components/generic/ErrorMessage', () => {
  it('displays the right illustration for the variant', async() => {
    const wrapper = factory();

    const illustration =  wrapper.vm.illustrationSrc;
    expect(illustration).toEqual('il-item-not-found.svg'); // as returned by @tests/unit/fileTransformer.cjs
  });
});
