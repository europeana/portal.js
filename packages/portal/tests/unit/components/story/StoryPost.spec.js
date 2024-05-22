import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import StoryPost from '@/components/story/StoryPost.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(StoryPost, {
  localVue,
  mocks: {
    $features: {},
    $d: () => {},
    $t: () => {},
    $tc: () => {}
  },
  propsData: {
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
        '<p>Hello</p>'
      ]
    }
  }
});

describe('components/story/StoryPost', () => {
  it('displays markdown data as HTML', () => {
    const wrapper = factory();

    expect(wrapper.find('[data-qa="story sections"]').html()).toContain('<p>Hello</p>');
  });

  it('removes the time from date string', () => {
    const wrapper = factory();

    expect(wrapper.find('[data-qa="date"]').html()).toContain('2019-10-03');
  });
});
