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
    text: { values: ['This is text that needs to be truncated'], code: 'en' }
  },
  mocks: {
    $t: () => {}
  }
});

describe('components/search/SearchBarPill', () => {
  it('truncates display text if characters are over `set character state` characters', () => {
    const wrapper = factory();

    wrapper.text().should.startWith('This is text that ne...');
    wrapper.find('b-badge-stub').attributes('title').should.eq('This is text that needs to be truncated');
  });

  it('doesn`t truncate text if characters are `set character state` or less', () => {
    const wrapper = factory();

    wrapper.setProps({
      text: { values: ['Less than twenty'], code: 'en' }
    });

    wrapper.text().should.startWith('Less than twenty');
    wrapper.find('b-badge-stub').attributes('title').should.eq('Less than twenty');
  });
});
