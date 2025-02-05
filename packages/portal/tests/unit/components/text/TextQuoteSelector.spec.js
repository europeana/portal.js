import { createLocalVue, shallowMount } from '@vue/test-utils';

import TextQuoteSelector from '@/components/text/TextQuoteSelector.vue';
import { propsData } from './TextQuoteSelector.fixtures.js';

const localVue = createLocalVue();

const factory = ({ propsData = {}, scopedSlots = {} } = {}) => shallowMount(TextQuoteSelector, {
  localVue,
  propsData,
  scopedSlots
});

describe('@/components/text/TextQuoteSelector.vue', () => {
  it('renders a span element by default', () => {
    const propsData = {
      text: 'This is a sentence'
    };

    const wrapper = factory({ propsData });

    expect(wrapper.element.tagName).toBe('SPAN');
  });

  it('overrides the root element with the `tag` prop', () => {
    const propsData = {
      tag: 'q',
      text: 'This is a sentence'
    };

    const wrapper = factory({ propsData });

    expect(wrapper.element.tagName).toBe('Q');
  });

  it('renders text with no selector using span', () => {
    const propsData = {
      text: 'This is a sentence'
    };

    const wrapper = factory({ propsData });

    expect(wrapper.find('span').text()).toBe(propsData.text);
  });

  it('renders text with a non-matching selector using span', () => {
    const wrapper = factory({ propsData: propsData.nonMatchingSelector });

    expect(wrapper.find('span').text()).toBe(propsData.nonMatchingSelector.text);
  });

  it('renders text with a single matching selector using strong', () => {
    const wrapper = factory({ propsData: propsData.singleMatchingSelector });

    expect(wrapper.text().startsWith('This is a sentence ')).toBe(true);
    expect(wrapper.text().endsWith(' one word to select')).toBe(true);
    expect(wrapper.find('strong').text()).toBe(propsData.singleMatchingSelector.selector.exact);
  });

  it('renders text with multiple matching selectors using strong', () => {
    const wrapper = factory({ propsData: propsData.multipleMatchingSelectors });

    const selected = wrapper.findAll('strong');

    expect(selected.at(0).text()).toBe('This');
    expect(selected.at(1).text()).toBe('sentence');
    expect(selected.at(2).text()).toBe('select');
  });

  it('overrides selected text markup with default slot', () => {
    const scopedSlots = {
      default: '<code slot-scope="chunk">{{ chunk.text }}</code>'
    };
    const wrapper = factory({ propsData: propsData.singleMatchingSelector, scopedSlots });

    expect(wrapper.find('code').text()).toBe(propsData.singleMatchingSelector.selector.exact);
  });

  it('overrides other text markup with other slot', () => {
    const scopedSlots = {
      other: '<i slot-scope="chunk">{{ chunk.text }}</i>'
    };
    const wrapper = factory({ propsData: propsData.singleMatchingSelector, scopedSlots });

    const other = wrapper.findAll('i');

    expect(other.at(0).text()).toBe('This is a sentence');
    expect(other.at(1).text()).toBe('one word to select');
  });
});
