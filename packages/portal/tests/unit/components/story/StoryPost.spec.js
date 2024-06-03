import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import StoryPost from '@/components/story/StoryPost.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const baseProps = {
  identifier: '123',
  title: 'This is a title',
  datePublished: '2019-10-03T00:00+00:00',
  hero: {
    license: 'https://creativecommons.org/licenses/by-sa/1.0/',
    image: {
      url: 'https://example.org'
    }
  },
  body: {
    items: [
      { '__typename': 'RichText',
        text: '<p>Hello</p>' }
    ]
  }
};

const factory = (propsData = baseProps) => shallowMount(StoryPost, {
  localVue,
  propsData,
  mocks: {
    $features: {},
    $d: () => {},
    $t: () => {},
    $tc: () => {}
  },
  stubs: ['StoryImageTextSlideScroller']
});

describe('components/story/StoryPost', () => {
  it('removes the time from date string', () => {
    const wrapper = factory();

    expect(wrapper.find('[data-qa="date"]').html()).toContain('2019-10-03');
  });

  describe('when there is an image text slide group', () => {
    it('renders the story image text slide scroller', () => {
      const props = {
        ...baseProps,
        body: {
          items: [...baseProps.body.items,
            { '__typename': 'ImageTextSlideGroup' }]
        }
      };
      const wrapper = factory(props);

      expect(wrapper.find('[data-qa="story image text slide scroller"]').exists()).toBe(true);
    });
  });
});
