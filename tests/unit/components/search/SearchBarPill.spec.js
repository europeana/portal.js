import { createLocalVue, shallowMount, RouterLinkStub } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import SearchBarPill from '../../../../components/search/SearchBarPill.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(SearchBarPill, {
  localVue,
  stubs: {
    NuxtLink: RouterLinkStub
  },
  propsData: {
    removeLinkTo: {},
    removeLinkLabel: {},
    text: ''
  },
  mocks: {
    $t: () => {}
  }
});

describe('components/search/SearchForm', () => {
  it('trunacates text if characters are over `set character state` characters', () => {
    const wrapper = factory();

    wrapper.setProps({
      text: 'This is text that needs to be truncated'
    });
    wrapper.vm.limitCharacters = 20;

    wrapper.vm.truncatedText.should.eq('This is text that ne…');
  });

  it('doesn`t trunacate text if characters are `set character state` or less', () => {
    const wrapper = factory();

    wrapper.setProps({
      text: 'Less than twenty'
    });
    wrapper.vm.limitCharacters = 20;

    wrapper.vm.truncatedText.should.eq('Less than twenty');
  });
});
