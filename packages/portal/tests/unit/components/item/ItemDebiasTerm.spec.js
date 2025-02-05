import { createLocalVue, shallowMount } from '@vue/test-utils';
import ItemDebiasTerm from '@/components/item/ItemDebiasTerm';

const localVue = createLocalVue();

const propsData = {
  term: 'debias term',
  definition: 'This text is the definition of the debias term'
};
const factory = () => shallowMount(ItemDebiasTerm, {
  localVue,
  propsData,
  mocks: {
    $t: (key) => key
  },
  stubs: ['b-button', 'b-tooltip', 'i18n']
});

describe('components/item/ItemDebiasTerm', () => {
  it('renders a term, button and tooltip container', () => {
    const wrapper = factory();

    expect(wrapper.find('dfn').text()).toEqual(propsData.term);
    expect(wrapper.find('b-button-stub').text()).toEqual('record.explanationby');
    expect(wrapper.find('#tooltip-container').exists()).toBe(true);
  });
});
