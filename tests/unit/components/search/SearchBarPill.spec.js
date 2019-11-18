import { createLocalVue, shallowMount, RouterLinkStub } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import SearchBarPill from '../../../../components/search/SearchBarPill.vue';

const localVue = createLocalVue();
localVue.filter('truncate', (val) => {
  return val.length > 20 ? val.substring(0, 20) + '...' : val;
});
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

describe('components/search/SearchBarPill', () => {
  it('truncates text if characters are over `set character state` characters', () => {
    const wrapper = factory();

    wrapper.setProps({
      text: 'This is text that needs to be truncated'
    });

    wrapper.text().should.startWith('This is text that ne...');
  });

  it('doesn`t truncate text if characters are `set character state` or less', () => {
    const wrapper = factory();

    wrapper.setProps({
      text: 'Less than twenty'
    });

    wrapper.text().should.startWith('Less than twenty');
  });
});
