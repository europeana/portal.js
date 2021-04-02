import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import BlogPost from '../../../../src/components/blog/BlogPost.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(BlogPost, {
  localVue,
  mocks: {
    $d: () => {},
    $t: () => {}
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

describe('components/blog/BlogPost', () => {
  it('displays markdown data as HTML', () => {
    const wrapper = factory();

    wrapper.find('[data-qa="blog-sections"]').html().should.contain('<p>Hello</p>');
  });

  it('removes the time from date string', () => {
    const wrapper = factory();

    wrapper.find('[data-qa="date"]').html().should.contain('2019-10-03');
  });
});
