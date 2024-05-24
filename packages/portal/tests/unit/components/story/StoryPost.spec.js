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
      url: 'https://example.org',
      width: 830,
      height: 470
    }
  },
  body: {
    items: [
      '<p>Hello</p>'
    ]
  }
};

const storyHeroProps = {
  ...baseProps,
  title: 'This is a title',
  subtitle: 'This is a subtitle'
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
  stubs: ['AuthoredHead', 'StoryHero']
});

describe('components/story/StoryPost', () => {
  it('removes the time from date string', () => {
    const wrapper = factory();

    expect(wrapper.find('[data-qa="date"]').html()).toContain('2019-10-03');
  });

  describe('when the hero image, title and subtitle pass the conditions to enable the story hero', () => {
    it('renders the story hero', () => {
      const wrapper = factory(storyHeroProps);

      expect(wrapper.find('[data-qa="story hero"]').exists()).toBe(true);
    });
  });

  describe('when the hero image is smaller than 800px width', () => {
    it('does not render the story hero, but the authored head', () => {
      const smallHeroImageProps = { ...storyHeroProps };
      smallHeroImageProps.hero.image.width = 799;

      const wrapper = factory(smallHeroImageProps);

      expect(wrapper.find('[data-qa="story hero"]').exists()).toBe(false);
      expect(wrapper.find('[data-qa="authored head"]').exists()).toBe(true);
    });
  });

  describe('when the title is longer than 80 characters', () => {
    it('does not render the story hero, but the authored head', () => {
      const longTitleProps = { ...storyHeroProps,
        title: 'This is a title that is longer than 80 characters and should disable the hero from being used' };
      const wrapper = factory(longTitleProps);

      expect(wrapper.find('[data-qa="story hero"]').exists()).toBe(false);
      expect(wrapper.find('[data-qa="authored head"]').exists()).toBe(true);
    });
  });

  describe('when the subtitle is longer than 140 characters', () => {
    it('does not render the story hero, but the authored head', () => {
      const longSubtitleProps = { ...storyHeroProps,
        subtitle: 'This is a subtitle that is longer than 140 characters and should disable the hero from being used. It should be really longer than 140 characters.' };
      const wrapper = factory(longSubtitleProps);

      expect(wrapper.find('[data-qa="story hero"]').exists()).toBe(false);
      expect(wrapper.find('[data-qa="authored head"]').exists()).toBe(true);
    });
  });

  describe('when there is a description', () => {
    describe('and the story hero is enabled', () => {
      it('renders the description in the article', () => {
        const storyHeroWithDescriptionProps = { ...storyHeroProps,
          description: 'This is a description' };
        const wrapper = factory(storyHeroWithDescriptionProps);

        expect(wrapper.find('article [data-qa="article description"]').exists()).toBe(true);
      });
    });

    describe('and the story hero is disabled', () => {
      describe('and there is a subtitle', () => {
        it('renders the description in the article', () => {
          const authoredHeadWithDescriptionProps = { ...baseProps,
            subtitle: 'This is a subtitle',
            description: 'This is a description' };
          const wrapper = factory(authoredHeadWithDescriptionProps);

          expect(wrapper.find('article [data-qa="article description"]').exists()).toBe(true);
        });
      });
    });
  });
});
