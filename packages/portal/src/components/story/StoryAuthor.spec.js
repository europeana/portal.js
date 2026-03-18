import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import StoryAuthor from '@/components/story/StoryAuthor.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = ({ propsData = {} } = {}) => shallowMount(StoryAuthor, {
  localVue,
  mocks: {},
  propsData
});

describe('components/story/StoryAuthor', () => {
  describe('when there is a url prop', () => {
    it('renders a smart link to url, with name as text', () => {
      const propsData = {
        name: 'A Writer',
        url: 'https://example.org/a.writer'
      };
      const wrapper = factory({ propsData });

      const smartLink = wrapper.find('smartlink-stub');

      expect(smartLink.attributes('destination')).toBe(propsData.url);
      expect(smartLink.text()).toBe(propsData.name);
    });
  });

  describe('when there is no url prop', () => {
    it('renders a span with name as text', () => {
      const propsData = {
        name: 'A Writer'
      };
      const wrapper = factory({ propsData });

      const authorName = wrapper.find('span');

      expect(authorName.text()).toBe(propsData.name);
    });
  });

  describe('when there is an organisation prop', () => {
    it('renders it in parentheses', () => {
      const propsData = {
        name: 'A Writer',
        organisation: 'The Company'
      };
      const wrapper = factory({ propsData });

      expect(wrapper.text().includes(`(${propsData.organisation})`)).toBe(true);
    });
  });
});
