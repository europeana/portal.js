import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import BlogPost from '../../../../components/blog/BlogPost.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(BlogPost, {
  localVue,
  mocks: {
    $d: () => {},
    $t: () => {}
  },
  propsData: {
    title: 'This is a title',
    body: '__Foo__ Hello',
    datePublished: '2019-10-03T00:00+00:00'
  }
});

describe('components/blog/BlogPost', () => {
  it('displays markdown data as HTML', () => {
    const wrapper = factory();

    wrapper.vm.html.should.contain('<p><strong>Foo</strong> Hello</p>');
  });

  it('removes the time from date string', () => {
    const wrapper = factory();

    wrapper.find('[data-qa="date"]').html().should.contain('2019-10-03');
  });
});
