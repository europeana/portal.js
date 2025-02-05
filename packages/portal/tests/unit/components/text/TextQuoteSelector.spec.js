import { createLocalVue, shallowMount } from '@vue/test-utils';

import TextQuoteSelector from '@/components/text/TextQuoteSelector.vue';

const localVue = createLocalVue();

const factory = ({ propsData = {}, scopedSlots = {} } = {}) => shallowMount(TextQuoteSelector, {
  localVue,
  propsData,
  scopedSlots
});

describe('@/components/text/TextQuoteSelector.vue', () => {
  it('renders a p element by default', () => {
    const propsData = {
      text: 'This is a sentence'
    };

    const wrapper = factory({ propsData });

    expect(wrapper.element.tagName).toBe('P');
  });

  it('overrides the root element with the `tag` prop', () => {
    const propsData = {
      tag: 'q',
      text: 'This is a sentence'
    };

    const wrapper = factory({ propsData });

    expect(wrapper.element.tagName).toBe('Q');
  });

  it('renders text with no selector', () => {
    const propsData = {
      text: 'This is a sentence'
    };

    const wrapper = factory({ propsData });

    expect(wrapper.text()).toBe(propsData.text);
  });

  it('renders text with a single selector using strong', () => {
    const propsData = {
      selector: {
        prefix: 'a sentence ',
        exact: { '@value': 'with' },
        suffix: ' one word'
      },
      text: 'This is a sentence with one word to select'
    };

    const wrapper = factory({ propsData });

    expect(wrapper.text().startsWith('This is a sentence ')).toBe(true);
    expect(wrapper.text().endsWith(' one word to select')).toBe(true);
    expect(wrapper.find('strong').text()).toBe(propsData.selector.exact['@value']);
  });

  it('renders text with multiple selectors using strong', () => {
    const propsData = {
      selector: [
        {
          prefix: 'is a ',
          exact: { '@value': 'sentence' },
          suffix: ' with'
        },
        {
          exact: { '@value': 'This' },
          suffix: ' is a'
        },
        {
          prefix: 'words to ',
          exact: { '@value': 'select' }
        }
      ],
      text: 'This is a sentence with multiple words to select'
    };

    const wrapper = factory({ propsData });
    const selected = wrapper.findAll('strong');

    expect(selected.at(0).text()).toBe('This');
    expect(selected.at(1).text()).toBe('sentence');
    expect(selected.at(2).text()).toBe('select');
  });

  it('overrides selected text markup with default slot', () => {
    const propsData = {
      selector: {
        prefix: 'a sentence ',
        exact: { '@value': 'with' },
        suffix: ' one word'
      },
      text: 'This is a sentence with one word to select'
    };
    const scopedSlots = {
      default: '<code slot-scope="chunk">{{ chunk.text }}</code>'
    };

    const wrapper = factory({ propsData, scopedSlots });

    expect(wrapper.find('code').text()).toBe(propsData.selector.exact['@value']);
  });

  it('overrides other text markup with other slot', () => {
    const propsData = {
      selector: {
        prefix: 'a sentence ',
        exact: { '@value': 'with' },
        suffix: ' one word'
      },
      text: 'This is a sentence with one word to select'
    };
    const scopedSlots = {
      other: '<i slot-scope="chunk">{{ chunk.text }}</i>'
    };

    const wrapper = factory({ propsData, scopedSlots });
    const other = wrapper.findAll('i');

    expect(other.at(0).text()).toBe('This is a sentence');
    expect(other.at(1).text()).toBe('one word to select');
  });
});
